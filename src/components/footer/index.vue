/*
 * @Author: kaker.xutianxing
 * @Date: 2018-08-28 10:22:54
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-09-29 17:45:43
 */
<template>
  <div class="my-footer">
    <tabbar >
      <tabbar-item link="/main/index" :selected="$route.path === '/main/index'">
        <img slot="icon" src="@/assets/icon/index.png">
        <img slot="icon-active" src="@/assets/icon/index2.png">
        <span slot="label">足迹</span>
      </tabbar-item>
      <tabbar-item :badge="num" link="/main/message" :selected="$route.path === '/main/message'">
        <img slot="icon" src="@/assets/icon/message.png">
        <img slot="icon-active" src="@/assets/icon/message2.png">
        <span slot="label">消息</span>
      </tabbar-item>
      <tabbar-item link="/main/contact" :selected="$route.path === '/main/contact'">
        <img slot="icon" src="@/assets/icon/contact.png">
        <img slot="icon-active" src="@/assets/icon/contact2.png">
        <span slot="label">通讯录</span>
      </tabbar-item>
      <tabbar-item link="/main/news" :selected="$route.path === '/main/news'">
        <img slot="icon" src="@/assets/icon/news.png">
        <img slot="icon-active" src="@/assets/icon/news2.png">
        <span slot="label">动态</span>
      </tabbar-item>
      <tabbar-item link="/main/self" :selected="$route.path === '/main/self'">
        <img slot="icon" src="@/assets/icon/self.png">
        <img slot="icon-active" src="@/assets/icon/self2.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
export default {
  name: 'myFooter',
  components: {
    Tabbar,
    TabbarItem
  },
  data () {
    return {
      red: '#fff000',
      num:'0',
    }
  },
  methods: {
  },
    watch:{
      '$store.state.message.messageList':{
          handler:function (val, oldVal) {
              let num = 0;
              val.map((data,i)=>{
                  num = num + data.num
              })

              this.num = num.toString();
          },

          deep: true
      }
    },
  // computed: {
  //   num () {
  //     const list = this.$store.state.message.messageList
  //     let i = 0
  //     list.forEach(e => {
  //       i += e.num
  //     })
  //     return i.toString()
  //   }
  // },
  mounted () {
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>

</style>
