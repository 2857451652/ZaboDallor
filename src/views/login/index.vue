<template>
  <div class="login-container">
    <div ref="vantaRef" style="width: 100%; height: 100vh; position:absolute"></div>
    <!-- <div class="logo_container">
      <img src="@/assets/images/school_white.png" width="70px" class="logo"/>
      <img src="@/assets/images/tianyi.png" height="65px"/>
    </div> -->
    <el-card class="login-card" shadow="hover" v-if="is_login">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" autocomplete="on" label-position="left">
        <el-row class="title2">
          <img src="@/assets/images/tiansuanlogo.png" width="50px" style="float: left;margin-left:30px"/>
          <span style="float:right;margin-right:40px;margin-top:5px">天算星座一体化展示平台</span>
        </el-row>
        <!-- <h3 class="title">
            <img src="@/assets/images/tiansuanlogo.png" width="50px"/>
            <span style="margin-bottom: 45px;">天算星座一体化展示平台</span>
        </h3> -->

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:20px;" 
        @click.native.prevent="handleLogin">进入主页/ENTER</el-button>
      </el-form>
      <el-link type="warning" style="right:0" @click="switch_mode">注册/REGISTER</el-link>
    </el-card>
    

    <el-card class="login-card" shadow="hover" v-else>
      <el-form ref="regForm" :model="regForm" :rules="loginRules" autocomplete="on" label-position="left">
        <el-row class="title2">
          <span style="margin-top:5px">加入我们 JOIN US</span>
        </el-row>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="regForm.username"
            placeholder="E-mail"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="regForm.password"
              :type="passwordType"
              placeholder="Set Password"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-form-item prop="description">
          <span class="svg-container">
            <i class="el-icon-s-comment"></i>
          </span>
          <el-input
            ref="description"
            v-model="regForm.description"
            placeholder="University and Your Name please"
            name="description"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-button :loading="loading" type="warning" style="width:100%;margin-bottom:20px;" 
        @click.native.prevent="handleRegister">注册/REGISTER</el-button>
      </el-form>
      <el-link type="primary" style="left:0" @click="switch_mode">返回/BACK</el-link>
    </el-card>


    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import {login, register} from '../../api/requests'
import SocialSign from './components/SocialSignin'
import {dynamicallyAddRoutes, resetRouter} from '../../router/index'
import * as THREE from 'three'//导入样式
import GLOBE from "vanta/src/vanta.globe";//导入动态样式逻辑

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('请输入正确用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于六位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        data: '',
        role: '',
      },
      regForm: {
        username: '',
        password: '',
        description: '',
      },
      saved_user: [{
        username: 'TianSuan',
        password: '15dajiaohuan'
      }],
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      background: require("@/assets/images/background.jpg"),
      vantaEffect: NaN,
      allow:false,
      is_login: true,
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.vantaEffect = GLOBE({
      el: this.$refs.vantaRef,
      THREE: THREE
    })
     // 修改颜色时 cells 需要全大写字母 可生效
     VANTA.GLOBE({
      el: this.$refs.vantaRef,
      /*以下为样式配置*/
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color: "#A066D3",
      size: 1.1,
      backgroundColor: "#0d1b37",
    });
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy()
    }
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    switch_mode() {
      this.is_login = !this.is_login
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    saveSession(){
      sessionStorage.setItem('user', this.loginForm.username);
      sessionStorage.setItem('role', this.loginForm.role);
      sessionStorage.setItem('token', this.loginForm.data);
      console.log(this.loginForm)
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          for(var i=0; i<this.saved_user.length; i++){
            if(this.saved_user[i].username == this.loginForm.username &&
               this.saved_user[i].password == this.loginForm.password)
              this.allow = true
          }
          if(this.allow){
            this.loginForm.role = 'admin'
            this.saveSession()
            dynamicallyAddRoutes()
            this.$store.dispatch('user/login', this.loginForm)
              .then(() => {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          }
          else{
            console.log("try contact backend")
            var qs = require('qs');
            var params = qs.stringify({
                uName: this.loginForm.username,
                uPwd: this.loginForm.password
            });
            login(params).then(result => {
              console.log(result)
              if(result.code == 0){
                this.$message.success(result.message);
                this.loginForm.data = result.data
                this.loginForm.role = 'visiter'
                this.saveSession()
                dynamicallyAddRoutes()
                this.$store.dispatch('user/login', this.loginForm)
                  .then(() => {
                    this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                    this.loading = false
                  })
                  .catch(() => {
                    this.loading = false
                  })
              }else if(result.code != 0){
                this.$message.error(result.message);
                this.loading = false
              }
            }).catch(function(error) {
              this.$message.error('登陆失败: ', error);
              this.loading = false
            });
            setTimeout(() => {
              if(this.loading == true){
                this.$message.error('请求超时');
                this.loading = false
              }
            }, 10000);
          }
        } else {
          console.log('发生错误!!')
          return false
        }
      })
    },
    handleRegister(){
      this.loading = true
      var qs = require('qs');
      var params = qs.stringify({
        uName: this.regForm.username,
        uPwd: this.regForm.password,
        uInfo: this.regForm.description,
      });
      register(params).then(result => {
        console.log(result)
        if(result.code == 0){
          this.$message.success("Successfully send register message. Please wait for confirm.");
        }else if(result.code != 0){
          this.$message.error(result.message);
          this.loading = false
        }
        this.loading = false
      }).catch(function(error) {
          this.$message.error('Oops, something goes wrong.');
          this.loading = false
        });
        setTimeout(() => {
          if(this.loading == true){
            this.$message.error('请求超时');
            this.loading = false
          }
        }, 10000);
      
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$bg2:#0d1b37;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  //background: url("../../assets/images/background.jpg");
  //background-size: cover;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .logo_container{
    top:1%;
    left:1%;
    position: absolute;
  }
  .logo{
    border-right: 2px solid #ccc; /* 设置分割线的颜色和宽度 */
    padding-right: 10px; /* 调整分割线与图片之间的距离 */
  }
  .login-card {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 25px 35px 0;
    overflow: hidden;
    background-color: rgba(45, 58, 75, 0.6);
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title {
      font-size: 26px;
      color: $light_gray;
      margin-bottom: 40px;
      text-align: center;
      font-weight: bold;
  }
  .title2 {
    color: $light_gray;
    font-size: 26px;
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    margin-bottom: 40px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {

  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
