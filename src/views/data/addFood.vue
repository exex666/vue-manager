<template>
  <div>
    <el-row class="formContainer">
      <el-col :span="14" :offset="4">
        <el-form action="" :model="formData"  method="post" class="form" label-width="100px">
            <h4 style="text-align:center;">选择食品种类</h4>
            <el-card class="categoryContainer" shadow="hover" body-style="padding:20px 0 45px;">
              <el-form-item label="食品种类" size="medium" style="padding-left:20px;padding-right:20px;">
                <el-select style="width:100%" v-model="formData.category_id" filterable class="tagSelect">
                  <el-option v-for="item in categoryList" :key="item.value" :label="item.name" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
                <div class="newCategory" :class="[{'expand':expand}]">
                  <div class="addCategory">
                    <el-form-item label="食品种类">
                    <el-input v-model="categoryForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="种类描述">
                    <el-input v-model="categoryForm.description"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitCate">提交</el-button>
                  </el-form-item>
                  </div>
                </div>
              <div class="expandButton" @click="expandCategory">
                <i :class="['dropDown',{'el-icon-caret-bottom':!expand,'el-icon-caret-top':expand}]">添加视频种类</i>
              </div>
            </el-card>
        </el-form>
        <el-form class="foodContainer" label-width="100px" ref="form" style="margin: 30px 0" :rules="rule" :model="formData" >
          <h4 style="text-align:center;">添加食品</h4>
            <el-card shadow="hover" >
                <el-form-item label="食品名称" prop="name">
                  <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="食品活动">
                  <el-input v-model="formData.activity"></el-input>
                </el-form-item>
                <el-form-item label="食品详情">
                  <el-input v-model="formData.description"></el-input>
                </el-form-item>
                <el-form-item label="上传食品图片">
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
                <el-form-item label="食品特点">
                   <el-select
                    v-model="formData.attributes"
                    multiple
                    default-first-option
                    placeholder="请选择"
                    >
                    <el-option
                      v-for="item in attributes"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="食品规格">
                  <el-radio v-model="specifications" label="single">单规格</el-radio>
                  <el-radio v-model="specifications" label="multiple">多规格</el-radio>
                </el-form-item>
                <el-dialog title="添加规格" :visible.sync="specsFormShow">
                  <el-form label-width="100px" :model="specsForm" ref="specsForm" :rules="specsRules">
                    <el-form-item label="规格" prop="name">
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
                    <el-button @click="show = false">取 消</el-button>
                    <el-button type="primary" @click="addSpecs">确 定</el-button>
                  </span>
                </el-dialog>
                <div class="single" v-if="specifications==='single'">
                  <el-form-item label="包装费">
                    <el-input-number :min="0" :max="100" v-model="packing_fee"></el-input-number>
                  </el-form-item>
                  <el-form-item label="起送价">
                    <el-input-number :min="0" :max="100" v-model="price"></el-input-number>
                  </el-form-item>
                </div>
                <div class="multiple" style="text-align:center;" v-else>
                  <el-button type="primary"  style="margin-bottom:10px;" @click="specsFormShow = true">添加规格</el-button>
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
                </div>
                <el-form-item >
                  <el-button type="primary" @click="submit">确认添加食品</el-button>
                </el-form-item>
            </el-card>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getShopCategory, http, addCategory, addFood } from '@/utils/http.js'
export default {
  name: 'AddFood',

  data() {
    return {
      categoryForm: {
        name: '',
        description: '',
      },
      specsForm: {
        specs: '',
        packing_fee: 0,
        price: 20,
      },
      specsRules: {
        specs: [
          { required: true, message: '请输入规格', trigger: 'blur', },
        ],
      },
      categoryList: [],
      specsFormShow: false,
      image_path: '',
      formData: {
        name: '',
        description: '',
        image_path: '',
        activity: '',
        attributes: [],
        specs: [{
          specs: '默认',
          packing_fee: 0,
          price: 20,
        }],
        packing_fee: 0,
        price: 20,
        category_id: '',
        restaurant_id: 1,
      },
      rule: {
        name: [
          { required: true, message: '请输入店铺名称', trigger: 'blur', },
        ],
      },
      baseUrl: http.defaults.baseURL,
      expand: false,
      specifications: 'single',
      attributes: [
        { name: '新品', value: '新', },
        { name: '招牌', value: '招牌', },
      ],
      packing_fee: 0,
      price: 20,
    }
  },
  beforeMount() {
    this.formData.restaurant_id = this.$route.query.resturantId || '1'
    if (!this.$route.query.resturantId) {
      this.$confirm('添加食品需要选择一个商铺，先去就去选择商铺吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$router.push('/shoplist')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消',
        })
      })
    }
    this.initData()
  },
  mounted() {
  },

  methods: {
    async initData() {
      const { data, } = await getShopCategory(this.formData.restaurant_id)
      this.categoryList = data.category_list.slice(0, 20).map(val => {
        return {
          name: val.name,
          value: val.id,
        }
      })
      console.log(this.categoryList)
    },
    async submitCate() {
      const { data, } = await addCategory({ name: this.categoryForm.name, description: this.categoryForm.description, })
      if (data.status) {
        this.$message({
          type: 'success',
          message: data.message,
        })
        this.categoryForm = {
          name: '',
          description: '',
        }
      } else {
        this.$message({
          type: 'warning',
          message: data.message,
        })
      }
    },
    expandCategory() {
      this.expand = !this.expand
    },
    specificationDelete(index) {
      this.formData.specs.splice(index, 1)
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
    submit() {
      this.$confirm('是否提交？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '提交',
        cancelButtonText: '放弃',
      }).then(async() => {
        this.$refs.form.validate(async(valid) => {
          if (valid) {
            const { data, } = await addFood(this.formData)
            if (data.status) {
              this.$message({
                type: 'success',
                message: '添加食品成功',
              })
              this.formData = {
                name: '',
                description: '',
                image_path: '',
                activity: '',
                attributes: [],
                specs: [{
                  specs: '默认',
                  packing_fee: 0,
                  price: 20,
                }],
                packing_fee: 0,
                price: 20,
                category_id: '',
              }
            } else {
              this.$message({
                type: 'warning',
                message: '添加食品失败',
              })
            }
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__label {
  font-size: 14px;
  font-weight: 400;
}
.categoryContainer {
  position: relative;
  .newCategory{
    background-color: #F9FAFC;
    height: 0;
    border-top:1px solid #EAEEFB;
    transition: all .5s;
    overflow: hidden;
    .addCategory {
      width: 100%;
      height: 100%;
      padding: 10px;
    }
  }
  .expand {
    height: 210px;
  }
  .expandButton {
    width: 100%;
    height: 45px;
    line-height: 45px;
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: center;
    color: #9D9D9D;
    cursor: pointer;
    transition: all .3s;
    border-top: 1px solid #EAEEFB;
    &:hover {
      color: #20A0FF;
      background-color: #F9FAFC;
    }
  }
}
.foodContainer {
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
}
</style>
