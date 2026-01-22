<template>
  <div class="common-layout">
    <el-container>
      <el-aside>
        <IeftAside></IeftAside>
      </el-aside>
      <el-container>
        <el-header>
          <el-card style="max-width: 100%;">
            <template #header>
              <div class="card-header">
                <div class="title"><span class="iconfont icon-zhankai zhankai"></span><span
                    class="shouye">首页</span>/<span class="jigouguanli">机构管理</span>/<span class="list">机构列表</span></div>
                <div class="icons">
                  <span class="iconfont icon-chaxun"></span>
                  <span class="iconfont icon-quanping"></span>
                  <span class="iconfont icon-daxiaoxie"></span>
                  <span class="iconfont icon-wen-A"></span>
                  <span class="iconfont icon-lingdang"></span>
                  <div class="login" v-on:click="login">
                    <img src="../../assets//image/login/logo.png" alt="">
                    <div>admin</div>
                  </div>
                  <span class="iconfont icon-shezhi1"></span>
                </div>
              </div>
            </template>
            <div class="tits">
              <div class="home">首页</div>
              <div class="tits_list"><span class="dian">·</span>机构列表<span class="iconfont icon-cheng cha"></span></div>
            </div>
            <!-- <div class="center">
              <div>个人中心</div>
              <div>注销登录</div>
            </div> -->
          </el-card>
        </el-header>
        <el-main style="background-color: #f2f3f5;">
          <router-view v-slot="{ Component }">
            <KeepAlive>
              <component v-if="$route.meta.keepAlive" :is="Component"></component>
            </KeepAlive>
            <component v-if="!$route.meta.keepAlive" :is="Component"></component>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang='ts'>
import IeftAside from '../../components/home/leftAside.vue'

const login = () => {

}

</script>

<style scoped lang='less'>
.el-header {
  height: 80px;
  margin-left: -20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  height: 15px;
  margin-top: -10px;
  line-height: 15px;

  .icons {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 12px;
    height: 40px;
    line-height: 50px;
    margin-top: -10px;

    span {
      width: 40px;
      height: 46px;
      text-align: center;

    }

    span:hover {
      background-color: #dcdbdb;
    }

    .login {
      width: 80px;
      height: 45px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 5px;
      padding-right: 5px;
      line-height: 80px;

      img {
        width: 20px;
        height: 20px;
        margin-top: 5px;
      }

      div {
        margin-top: 3px;
      }
    }

    .login:hover {
      background-color: #dcdbdb;
      cursor: pointer;
    }
  }

  .icons>span:hover {
    cursor: pointer;

  }

}

/deep/.el-aside {
  width: 200px;
  min-height: 100vh;
  background-color: #304156;
}

.title {
  font-size: 14px;
  margin-top: 5px;
}

.zhankai {
  font-size: 14px;
  margin-right: 10px;
  color: #000;
}



.jigouguanli {
  margin: 0 6px;
}

.shouye {
  margin: 0 6px;
}

.list {
  color: #999;
  margin: 0 6px;
}

.tits {
  margin-top: -15px;
  display: flex;

  .home {
    display: flex;
    width: 38px;
    height: 23px;
    font-size: 12px;
    border: 1px solid #999;
    margin-right: 10px;
    // text-align: center;
    justify-content: center;
    align-items: center;
  }

  .tits_list {
    display: flex;
    width: 85px;
    height: 25px;
    font-size: 12px;
    // text-align: center;
    align-items: center;
    color: #fff;
    background-color: rgba(3, 113, 239, 0.993);
    justify-content: center;

    // position: relative;
    .dian {
      font-size: 12px;
      // position: absolute;
      // top: 0;
      // left: 5;
    }

    .cha {
      font-size: 12px;
      margin-left: 5px;
      // position: absolute;
      // top: 0;
      // right: 5;
    }
  }
}
</style>