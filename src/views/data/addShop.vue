<template>
  <el-row class="formContainer">
    <el-col :span="12" :offset="4" >
  <el-form action="" :rules="rule" :model="formData"  method="post" ref="form" class="form" label-width="150px">
      <el-form-item label="店铺名称" prop="name">
        <el-input placeholder="请输入店铺名称" v-model="formData.name" ></el-input>
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
        <span>当前城市：{{city}}</span>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input  placeholder="请输入联系电话" v-model.number="formData.phone" ></el-input>
      </el-form-item>
      <el-form-item label="店铺介绍" >
        <el-input v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="店铺标语" >
        <el-input v-model="formData.promotion_info"></el-input>
      </el-form-item>
      <el-form-item label="店铺分类" >
        <el-cascader
          v-model="formData.category"
          :options="classify"
          :props="{ expandTrigger: 'hover' }"
          >
        </el-cascader>
      </el-form-item>
      <el-form-item label="店铺特点" class="characteristic">
        <div>
          <span>品牌保证</span>
          <el-switch
            v-model="formData.is_premium">
          </el-switch>
          <span>蜂鸟专送</span>
          <el-switch
            v-model="formData.delivery_mode">
          </el-switch>
          <span>新开店铺</span>
          <el-switch
            v-model="formData.new">
          </el-switch>
        </div>
        <div>
          <span>外卖保</span>
          <el-switch
            v-model="formData.bao"
            >
          </el-switch>
          <span>准时达</span>
          <el-switch
            v-model="formData.zhun">
          </el-switch>
          <span>开发票</span>
          <el-switch
            v-model="formData.piao">
          </el-switch>
        </div>
      </el-form-item>
      <el-form-item label="配送费">
          <el-input-number :min="1" :max="10" v-model="formData.float_delivery_fee" ></el-input-number>
      </el-form-item>
      <el-form-item label="起送价">
          <el-input-number :min="1" :max="10" v-model="formData.float_minimum_order_amount" ></el-input-number>
      </el-form-item>
      <el-form-item label="营业时间">
          <el-time-select
            placeholder="起始时间"
            v-model="formData.startTime"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }">
          </el-time-select>
          <el-time-select
            placeholder="结束时间"
            v-model="formData.endTime"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30',
              minTime: formData.startTime
            }">
          </el-time-select>
      </el-form-item>
      <el-form-item label="上传店铺头像">
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
      <el-form-item label="上传营业执照">
          <el-upload
            class="image-uploader"
            :action="baseUrl + '/v1/addimg/shop'"
            :show-file-list="false"
            :on-success="(res,file)=>{
              return handleAvatarSuccess(res,file,'business_license_image')
            }"
            :before-upload="beforeAvatarUpload"
            >
            <img v-if="business_license_image" :src="business_license_image" class="image">
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
      </el-form-item>
      <el-form-item label="上传餐饮服务许可证">
          <el-upload
            class="image-uploader"
            :action="baseUrl + '/v1/addimg/shop'"
            :show-file-list="false"
            :on-success="(res,file)=>{
              return handleAvatarSuccess(res,file,'catering_service_license_image')
            }"
            :before-upload="beforeAvatarUpload"
            >
            <img v-if="catering_service_license_image" :src="catering_service_license_image" class="image">
            <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
      </el-form-item>
      <el-form-item label="优惠活动">
        <el-select  placeholder="请选择" value="请选择" @change="promotionSelect($event)">
          <el-option
            v-for="(item,index) in promotion_option"
            :key="item.value"
            :value="index"
            :disabled="item.disabled"
            :label="item.label"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0">
        <el-table
          :data="formData.activities"
          style="width: 100%;border:1px solid #DFE6EC;">
          <el-table-column
            prop="icon_name"
            label="活动标题"
             width="150%"
            >
          </el-table-column>
          <el-table-column
            prop="name"
            label="活动名称"
             width="150%"
            >
          </el-table-column>
          <el-table-column
            prop="description"
            label="活动详情"
             >
          </el-table-column>
          <el-table-column label="操作"  width="150%;">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="promotionDelete(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">立即创建</el-button>
        </el-form-item>
    </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { foodCategory, cityGuess, http, searchplace, addShop } from '@/utils/http.js'
export default {
  name: 'AddShop',
  components: {
  },
  data() {
    return {
      city: '',
      formData: {
        latitude: null,
        longitude: null,
        name: '',
        address: '',
        phone: null,
        description: '',
        promotion_info: '',
        category: [],
        is_premium: true,
        delivery_mode: true,
        new: true,
        bao: true,
        zhun: true,
        piao: true,
        float_delivery_fee: 5,
        float_minimum_order_amount: 20,
        startTime: '',
        endTime: '',
        image_path: '',
        business_license_image: '',
        catering_service_license_image: '',
        activities: [
          {
            icon_name: '减',
            name: '优惠满减',
            description: '满30减5，满60减8',
            index: 0,
          },
        ],
      },
      image_path: '',
      business_license_image: '',
      catering_service_license_image: '',
      querySearch: [],
      baseUrl: http.defaults.baseURL,
      promotion_option: [
        {
          value: '满减优惠',
          label: '满减优惠',
          disabled: true,
        },
        {
          value: '优惠大酬宾',
          label: '优惠大酬宾',
          disabled: false,
        },
        {
          value: '新用户立减',
          label: '新用户立减',
          disabled: false,
        },
        {
          value: '进店领券',
          label: '进店领券',
          disabled: false,
        },
      ],
      classify: [],
      rule: {
        name: [
          { required: true, message: '请输入店铺名称', trigger: 'blur', },
          { required: true, min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur', },
        ],
        address: [
          { required: true, message: '请输入店铺地址', trigger: 'blur', },
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur', },
          { type: 'integer', message: '手机号必须为数字', trigger: 'blur', },
        ],
      },
    }
  },

  mounted() {
    this.initData()
  },

  methods: {
    change(e) {
      console.log(e.value)
    },
    async addressSuggest(str, cb) {
      const { data, } = await searchplace({ cityid: this.cityId, value: str, })
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
    promotionDelete(index) {
      this.promotion_option[this.tableData[index].index].disabled = false
      this.formData.activities.splice(index, 1)
    },
    promotionSelect(index) {
      this.$prompt('请输入活动详情', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\S]+/,
        inputErrorMessage: '输入格式不正确',
      }).then(({ value, }) => {
        this.$message({
          type: 'success',
          message: '活动添加成功',
        })
        this.formData.activities.push({
          icon_name: this.promotion_option[index].label.charAt(0),
          name: this.promotion_option[index].label,
          description: value,
          index: index,
        })
        this.promotion_option[index].disabled = true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入',
        })
      })
    },
    async initData() {
      const { data: location, } = await cityGuess()
      this.formData.latitude = location.latitude
      this.formData.longitude = location.longitude
      this.city = location.name
      this.cityId = location.id
      const { data, } = await foodCategory()
      this.classify = data.filter(val => {
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
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('是否提交？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '提交',
            cancelButtonText: '放弃',
          }).then(async() => {
            const params = {
              ...this.formData,
              category: this.formData.category.join('/'),
            }
            const { data, } = await addShop(params)
            if (data.status) {
              this.$message({
                type: 'success',
                message: '添加餐馆成功',
              })
              this.formData = {
                latitude: null,
                longitude: null,
                name: '',
                address: '',
                phone: '',
                description: '',
                promotion_info: '',
                category: [],
                is_premium: true,
                delivery_mode: true,
                new: true,
                bao: true,
                zhun: true,
                piao: true,
                float_delivery_fee: 5,
                float_minimum_order_amount: 20,
                startTime: '',
                endTime: '',
                image_path: '',
                business_license_image: '',
                catering_service_license_image: '',
              }
            } else {
              this.$message({
                type: 'warning',
                message: '添加餐馆失败',
              })
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  .formContainer {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    .form {
      padding-top: 20px;
      min-width: 600px;
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
  }
</style>
