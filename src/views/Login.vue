<template>
  <div class="content">
    <header-bar align="left">登录</header-bar>
    <div class="main-content">
      <div class="padded">
        <field placeholder="输入用户名" v-model="info.userid">
          <span class="iconfont icon-account"></span>
        </field>
        <field placeholder="输入6-18密码" v-model="info.password" type="password">
          <span class="iconfont icon-lock"></span>
        </field>
        <button class="btn-primary btn-block" @click="clickLoginBtn">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    HeaderBar: require("components/HeaderBar"),
    Field: require("components/Field")
  },
  name: "Login",
  data() {
    return {
      info: {
        userid: "",
        password: "",
        grant_type: "password"
      }
    };
  },
  methods: {
    clickLoginBtn() {
      this.$api.login(this.info).then(result => {
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.padded {
  margin: 0 16px;
}
button {
  margin-top: 35px;
}
</style>