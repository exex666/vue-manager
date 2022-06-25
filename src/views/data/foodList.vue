<template>
  <div class="listContainer">
    <table class="table  table-hover" >
      <thead bgcolor="#EEF1F6">
        <tr>
          <th width="3%"></th>
          <th width="30%"><div style="margin-left:10px;">食物名称</div></th>
          <th width="35%">食品介绍</th>
          <th width="20%">评分</th>
          <th width="12%">操作</th>
        </tr>
      </thead>
      <tbody v-if="listData.length>0">
        <template v-for="(item,index) in listData">
          <tr :key="'synopsis'+item.item_id" >
            <td style="cursor:pointer;padding: 0;position:relative;" @click="expand(index)">
              <div class="iconBox">
                <div :class="['iconfont','icon-113fangxiang_xiangyou',{'iconBoxDown':item.expand}]"></div>
              </div>
            </td>
            <td class="item">{{item.name}}</td>
            <td class="item">{{item.description|| '无'}}</td>
            <td class="item">{{item.rating}}</td>
            <td class="item">
                <button class="btn " @click="showForm(index)">编辑</button>
                <button class="btn btn-danger" @click="deleteFood(item.item_id)">删除</button>
            </td>
          </tr>
          <tr v-if="item.expand&&item.expandData" :key="'detail'+item.item_id" >
            <td colspan="5" style="padding: 0;" >
              <div class="Detail">
                  <div class="detailItem">
                    <div class="name">食品名称</div>
                    <div class="value">
                      <div>{{item.expandData.name}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">餐馆名称</div>
                    <div class="value">
                      <div>{{item.expandData.shop_name}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">食品 ID</div>
                    <div class="value">
                      <div>{{item.expandData.id}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">餐馆 ID</div>
                    <div class="value">
                      <div>{{item.expandData.shop_id}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">食品介绍</div>
                    <div class="value">
                      <div>{{item.expandData.description|| '无'}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">餐馆地址</div>
                    <div class="value">
                      <div>{{item.expandData.shop_address}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">食品评分</div>
                    <div class="value">
                      <div>{{item.expandData.rating}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">食品分类</div>
                    <div class="value">
                      <div>{{item.expandData.category}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">月销量</div>
                    <div class="value">
                      <div>{{item.expandData.month_sales}}</div>
                    </div>
                  </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
      <tr v-else>
        <td colspan="5" align="center" height="50">暂无数据</td>
      </tr>
    </table>
    <div class="pager">
      <Pager  @pagechange="pageChange" :totalPage="allPage" :count="count"></Pager>
    </div>
    <el-dialog title="修改食品信息" width="50%" top="10vh" :visible.sync="show">
       <el-form  label-width="100px" ref="form" :rules="rule" :model="formData" >
          <el-form-item label="食品名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="食品介绍">
            <el-input v-model="formData.description"></el-input>
          </el-form-item>
          <el-form-item label="食品种类" size="medium">
          <el-select  v-model="formData.category_name" filterable class="tagSelect">
            <el-option v-for="(item,index) in categoryList" :key="index" :value="item.value">
              {{item.name}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="食品图片">
          <el-upload
            class="image-uploader"
            :action="baseUrl + '/v1/addimg/food'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            >
            <img v-if="image_path" :src="image_path" class="image">
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>
          <div class="multiple" style="text-align:center;" >
            <el-form-item label-width="0">
              <el-table
                :data="formData.specs"
                style="width: 100%;border:1px solid #DFE6EC;"
                size="mini"
                cell-class-name="tableCell"
                header-cell-class-name="tableCell">
                <el-table-column
                  prop="specs"
                  label="规格"
                  >
                </el-table-column>
                <el-table-column
                  prop="packing_fee"
                  label="包装费"
                  >
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="价格"
                  >
                </el-table-column>
                <el-table-column label="操作" >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="specificationDelete(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-button type="primary"  style="margin-bottom:10px;" @click="specsFormShow = true">添加规格</el-button>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="show = false">取 消</el-button>
          <el-button type="primary" @click="update(editSelected)">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="添加规格"  :visible.sync="specsFormShow">
      <el-form label-width="100px" :model="specsForm" ref="specsForm" :rules="specsRules">
        <el-form-item label="规格" prop="specs_name">
          <el-input v-model="specsForm.specs"></el-input>
        </el-form-item>
        <el-form-item label="包装费">
          <el-input-number v-model="specsForm.packing_fee"></el-input-number>
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="specsForm.price"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="specsFormShow = false">取 消</el-button>
        <el-button type="primary" @click="addSpecs">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pager } from '@/mixin/pagerMix.js'
import { getFoodList, getFoodCount, getFoodCategory, getShop, http, getShopCategory, updateFood, deleteFood } from '@/utils/http.js'
export default {
  name: 'FoodList',
  mixins: [pager],
  data() {
    return {
      formData: {
        name: '',
        description: '',
        image_path: '',
        item_id: null,
        category_name: '',
        category_id: null,
        new_category_id: null,
        restaurant_id: null,
        specs: [],
      },
      formDataBase: {},
      rule: {
        name: [
          { required: true, message: '请输入食品名称', trigger: 'blur', },
        ],
      },
      specsForm: {
        specs: '',
        price: 20,
        packing_fee: 0,
      },
      specsRules: {
        specs: [
          { required: true, message: '请输入规格', trigger: 'blur', },
        ],
      },
      show: false,
      specsFormShow: false,
      categoryList: [],
      editSelected: null,
      baseUrl: http.defaults.baseURL,
      image_path: '',
    }
  },

  mounted() {
    this.initTable(true)
  },

  methods: {
    async expand(index) {
      if (!this.listData[index].expandData) {
        const expandData = {}
        expandData.description = this.listData[index].description
        expandData.rating = this.listData[index].rating
        expandData.name = this.listData[index].name
        expandData.id = this.listData[index].item_id
        expandData.month_sales = this.listData[index].month_sales
        expandData.shop_id = this.listData[index].restaurant_id
        const { data, } = await getShop(this.listData[index].restaurant_id)
        expandData.shop_name = data.name
        expandData.shop_address = data.address
        expandData.category = (await getFoodCategory(this.listData[index].category_id)).data.name
        this.listData[index].expandData = expandData
      }
      this.listData[index].expand = !this.listData[index].expand
    },
    async getList(params) {
      return await getFoodList(params)
    },
    async getCount() {
      return await getFoodCount()
    },
    async showForm(index) {
      if (this.editSelected !== index) {
        this.editSelected = index
        this.formData = {
          name: this.listData[index].name,
          description: this.listData[index].description,
          image_path: this.listData[index].image_path,
          item_id: this.listData[index].item_id,
          category_name: (await getFoodCategory(this.listData[index].category_id)).data.name,
          category_id: this.listData[index].category_id,
          restaurant_id: this.listData[index].restaurant_id,
          new_category_id: this.listData[index].category_id,
          specs: this.listData[index].specfoods.map((val) => {
            return {
              specs: val.specs_name,
              price: val.price,
              packing_fee: val.packing_fee,
            }
          }),
        }
        this.image_path = this.baseUrl + '/img/' + this.formData.image_path
        const { data, } = await getShopCategory(this.listData[index].restaurant_id)
        this.categoryList = data.category_list.map(val => {
          return {
            name: val.name,
            value: val.name,
          }
        })
      }
      this.formDataBase = JSON.stringify(this.formData)
      this.show = true
    },
    specificationDelete(index) {
      this.formData.specs.splice(index, 1)
    },
    addSpecs() {
      this.$refs.specsForm.validate((valid) => {
        if (valid) {
          this.formData.specs.push(this.specsForm)
          this.specsForm = {
            specs: '',
            price: 20,
            packing_fee: 0,
          }
          this.specsFormShow = false
        } else {
          this.$message({
            type: 'warning',
            message: '规格不能为空',
          })
        }
      })
    },
    update(index) {
      this.$refs.form.validate(async(valid) => {
        if (this.formDataBase === JSON.stringify(this.formData)) {
          this.show = false
          return
        }
        if (valid) {
          const { data, } = await updateFood(this.formData)
          if (data.status === 1) {
            this.$message({
              type: 'success',
              message: data.success,
            })
            this.listData[index].name = this.formData.name
            this.listData[index].description = this.formData.description
            this.listData[index].image_path = this.formData.image_path
            this.listData[index].specfoods = this.formData.specs
          } else {
            this.$message({
              type: 'error',
              message: '修改食品信息失败',
            })
          }
          this.show = false
        } else {
          this.$message({
            type: 'warning',
            message: '规格不能为空',
          })
        }
      })
    },
    async deleteFood(id) {
      const { data, } = await deleteFood(id)
      if (data.status === 1) {
        this.$message({
          type: 'success',
          message: data.message,
        })
        this.getData()
      } else {
        this.$message({
          type: 'warning',
          message: data.message,
        })
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.status) {
        this.image_path = URL.createObjectURL(file.raw)
        this.formData.image_path = res.image_path
      } else {
        this.$message({
          type: 'warning',
          message: '图片上传失败',
        })
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

  },
}
</script>

<style lang="scss" scoped>
  @import '@/sass/table.scss';
  ::v-deep .el-dialog__header {
        padding-bottom: 0;
      }
  ::v-deep .el-dialog__footer {
    padding-bottom: 10px;
  }
  ::v-deep .el-tag.el-tag--info {
    background-color: #E8F5FF !important;
    border: 0.5px solid #D4ECFF !important;
    color: #20A0FF !important;
  }
  ::v-deep .el-tag__close.el-icon-close {
    content: '';
    background-color: #fff;
    border-radius: 50%;
    &:hover {
      background-color: #999a9b;
      color: #fff;
    }
  }
  %uploader {
    width: 120px;
    height: 120px;
    display: block;
    cursor: pointer;
    border: 1px dashed #d1d8e1;
    overflow: hidden;
    border-radius: 5px;
    &:hover {
      border-color: #409EFF;
    }
  }
  .image-uploader .el-upload {
    position: relative;
    overflow: hidden;
  }
  .image-uploader-icon,.image {
    @extend %uploader;
    line-height: 120px;
    text-align: center;
  }
  ::v-deep .el-upload__input {
    display: none;
  }
  .tableCell {
    height:40px;
    text-align: center;
  }
</style>
