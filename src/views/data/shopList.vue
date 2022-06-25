<template>
  <div class="listContainer">
    <table class="table  table-hover" >
      <thead bgcolor="#EEF1F6">
        <tr>
          <th width="3%"></th>
          <th width="30%"><div style="margin-left:10px;">店铺名称</div></th>
          <th width="25%">店铺地址</th>
          <th width="27%">店铺介绍</th>
          <th width="15%" style="min-width:170px;">操作</th>
        </tr>
      </thead>
      <tbody v-if="listData.length>0">
        <template v-for="(item,index) in listData">
          <tr :key="'synopsis'+item.id" >
            <td style="cursor:pointer;padding: 0;position:relative;" @click="item.expand=!item.expand">
              <div class="iconBox">
                <div :class="['iconfont','icon-113fangxiang_xiangyou',{'iconBoxDown':item.expand}]"></div>
              </div>
            </td>
            <td class="item">{{item.name}}</td>
            <td class="item">{{item.address}}</td>
            <td class="item">{{item.description}}</td>
            <td class="item">
                <button class="btn" @click="edit(index)">编辑</button>
                <button class="btn" @click="addFood(item.id)">添加食品</button>
                <button class="btn btn-danger" @click="shopDelete(item.id)">删除</button>
            </td>
          </tr>
          <tr v-if="item.expand" :key="'detail'+item.id" >
            <td colspan="5" style="padding: 0;" >
              <div class="Detail">
                  <div class="detailItem" >
                    <div class="name">店铺名称</div>
                    <div class="value">
                      <div>{{item.name}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">店铺介绍</div>
                    <div class="value">
                      <div>{{item.description}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">联系电话</div>
                    <div class="value">
                      <div>{{item.phone}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">销售量</div>
                    <div class="value">
                      <div>{{item.recent_order_num}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">店铺地址</div>
                    <div class="value">
                      <div>{{item.address}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name"> 店铺 ID</div>
                    <div class="value">
                      <div>{{item.id}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">评分</div>
                    <div class="value">
                      <div>{{item.rating}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">分类</div>
                    <div class="value">
                      <div>{{item.category}}</div>
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
    <el-dialog title="修改店铺信息" top="10vh" class="dialog"  :visible.sync="show">
      <el-form :rules="rule" :model="formData"  method="post" ref="editForm" class="form" label-width="100px">
      <el-form-item label="店铺名称" prop="name">
        <el-input placeholder="请输入店铺名称" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-autocomplete
          class="inline-input"
          v-model="formData.address"
          :fetch-suggestions="addressSuggest"
          placeholder="请输入地址"
          :trigger-on-focus="false"
          style="width:100%;"
        ></el-autocomplete>
        <span>当前城市：{{location.name}}</span>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input placeholder="请输入联系电话" v-model="formData.phone" ></el-input>
      </el-form-item>
      <el-form-item label="店铺介绍" >
        <el-input v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="店铺分类" >
        <el-cascader
          v-model="formData.category"
          :options="classify"
          :props="{ expandTrigger: 'hover' }"
          >
        </el-cascader>
      </el-form-item>
      <el-form-item label="商铺图片">
          <el-upload
            class="image-uploader"
            :action="baseUrl + '/v1/addimg/shop'"
            :show-file-list="false"
            :on-success="(res,file)=>{
              return handleAvatarSuccess(res,file,'image_path')
            }"
            :before-upload="beforeAvatarUpload"
            >
            <img v-if="image_path" :src="image_path" class="image">
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="update(editSelected)">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { pager } from '@/mixin/pagerMix.js'
import { cityGuess, getShopList, getShopCount, http, searchplace, foodCategory, deleteShop, updateShop } from '@/utils/http.js'
export default {
  name: 'ShopList',
  mixins: [pager],
  data() {
    return {
      formData: {
        name: '',
        address: '',
        phone: '',
        description: '',
        category: '',
        image_path: '',
        id: null,
      },
      formDataBase: '',
      editSelected: null,
      location: {
        city: '',
        longitude: '',
        latitude: '',
      },
      image_path: '',
      baseUrl: http.defaults.baseURL,
      classify: [],
      show: false,
      rule: {
        name: [
          { required: true, message: '请输入店铺名称', trigger: 'blur', },
          { required: true, min: 2, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur', },
        ],
        address: [
          { required: true, message: '请输入店铺地址', trigger: 'blur', },
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur', },
          { required: true, len: 11, message: '长度为 11 个字符', trigger: 'blur', },
        ],
      },
    }
  },

  mounted() {
    this.getLocation()
  },
  methods: {
    async getLocation() {
      const { data, } = await cityGuess()
      this.location = data
      const { longitude, latitude, } = data
      const params = {
        longitude,
        latitude,
      }
      this.initTable(true, params)
      const { data: classify, } = await foodCategory()
      this.classify = classify.filter(val => {
        if (val.name === '全部商家') return false
        return true
      }).map(val => {
        return {
          value: val.name,
          label: val.name,
          children: val.sub_categories.filter(sub => {
            if (sub.level === 1) return false
            return true
          }).map(sub => {
            return {
              value: sub.name,
              label: sub.name,
            }
          }),
        }
      })
    },
    async getList(params) {
      return await getShopList(params)
    },
    async getCount() {
      return await getShopCount()
    },
    addFood(id) {
      this.$router.push({ path: '/addfood', query: { resturantId: id, }, })
    },
    edit(index) {
      if (this.selectedIndex !== index) {
        this.selectedIndex = index
        for (var key in this.formData) {
          this.formData[key] = (this.listData[index])[key]
        }
        this.formData.category = this.formData.category.split('/')
        this.image_path = this.baseUrl + '/img/' + this.formData.image_path
      }
      this.formDataBase = JSON.stringify(this.formData)
      this.show = true
    },
    update(index) {
      this.$refs.editForm.validate(async(valid) => {
        if (this.formDataBase === JSON.stringify(this.formData)) {
          this.show = false
          return
        }
        if (valid) {
          const params = {
            ...this.formData,
            category: this.formData.category.join('/'),
          }
          const { data, } = await updateShop(params)
          if (data.status) {
            this.$message({
              type: 'success',
              message: data.message,
            })
            this.listData[index] = params
          } else {
            this.$message({
              type: 'warning',
              message: data.message,
            })
          }
          this.show = false
        }
      })
    },
    async addressSuggest(str, cb) {
      const { data, } = await searchplace({ cityid: this.location.id, value: str, })
      const suggest = data.map(val => {
        return {
          value: val.address,
        }
      })
      cb(suggest)
    },
    handleAvatarSuccess(res, file, name) {
      if (res.status) {
        this.$data[name] = URL.createObjectURL(file.raw)
        this.formData[name] = res.image_path
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
    async shopDelete(id) {
      const { data, } = await deleteShop(id)
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
  },
}
</script>

<style lang="scss" scoped>
  @import '@/sass/table.scss';
    .dialog {
      ::v-deep .el-dialog__header {
        padding-bottom: 0;
      }
      ::v-deep .el-dialog__footer {
        padding-bottom: 10px;
      }
      }
    .form {
      .el-form-item {
        margin-bottom: 20px;
      }
      ::v-deep .el-form-item__label {
        font-size: 14px;
        font-weight: 400;
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
      .characteristic span {
        font-size: 15px;
        margin:0 3px 0 10px;
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
  }
</style>
