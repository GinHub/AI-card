/*
 * @Author: kaker.xutianxing
 * @Date: 2018-08-28 17:27:30
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-09-27 16:09:48
 * 动态
 */
<template>
<div class="news">
  <scroller
      height="100%"
      lock-x
      :use-pulldown="true"
      :use-pullup="true"
      :pullup-config="pullup_config"
      @on-pullup-loading="loadMore"
      ref="scrollerBottom"
      v-model="scrollerStatus"
      @on-pulldown-loading="Refresh"
      :pulldown-config="pullup_config">
    <div class="scroller_frame">
      <div class="header">
        <p>{{$store.state.user.info.username}}</p>
        <img :src="$store.state.user.info.image ? $store.state.user.info.image : '@/assets/img/moren.jpg'">
        <i @click="to_publish"><x-icon type="ios-camera"></x-icon></i>
      </div>

      <!--每条-->
      <div class="news-list" v-for="(item,i) in data_list" :key="i">
        <img :src="item.user_image" alt="" class="emotion">

        <div class="title">
          <p>
            <span class="name">{{item.user_name}}</span>
            <span class="tag">{{item.type == 0 ? '公司' : '个人'}}</span>
            <span class="time"></span>
          </p>
        </div>
        <div class="content clearfix">

          <p>{{item.title}}</p>
          <span v-for="(img_item, img_index) in item.cover" :key="img_index" :class="{'img-one': pic_list.length === 1}" class="img-wrap">
            <img :src="img_item.src" class="previewer-demo-img" @click="show(img_item)" v-if="item.type == 1">
            <img :src="img_item.src" class="previewer-demo-img" @click="to_details(item)" v-if="item.type == 0">
          </span>
        </div>
        <div class="comment ">
          <div class="icon-time">
            <popover placement="left">
              <div slot="content" class="popover-content">
                <span @click="good(item,i)">
                  <img src="@/assets/img/heart.png" v-if="item.praise && item.praise.is_praise == 0">
                  <img src="@/assets/img/heart_s.png" v-if="item.praise && item.praise.is_praise == 1">
                  点赞
                </span>
                <span @click="open_commentDialog(item,i)"><img src="@/assets/img/comment2.png" alt="">评论</span>
              </div>
              <img src="@/assets/img/comment.png" alt="" class="fr comment-icon">
            </popover>
            <span>{{item.time}}</span>
          </div>
          <div class="comment-content">
            <div style="height: 0.15rem" v-if="item.praise && item.praise.rows.length > 0 && item.comment && item.comment.rows.length > 0"></div>
            <p class="comment-zan" v-if="item.praise && item.praise.rows.length > 0">
                <img src="@/assets/img/heart-blue.png" alt="" class="heart">
                <span v-for="(p_item,i) in item.praise.rows" :key="i">
                  <img :src="p_item.user_image" alt="">
                  <i>{{p_item.user_name}}</i>
                </span>
            </p>

            <ul>

              <li class="clearfix" v-for="(comment,comment_i) in item.comment.rows" :key="comment_i">
                <img :src="comment.user_image ? comment.user_image : '@/assets/img/comment.png'" class="fl">
                <p><span class="name">{{comment.user_name}}:</span>{{comment.content}}</p>
              </li>

            </ul>
          </div>
        </div>
      </div>

    </div>
  </scroller>
  <div v-transfer-dom>
    <previewer :list="pic_list" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
  </div>

  <div v-transfer-dom class="dialog">
    <x-dialog
          :show.sync="commentDialog"
          @on-hide="dialog_hide"
          hide-on-blur>
      <p class="dialog-comment clearfix">
        <input type="text" v-model="comment_content" autofocus></input>
        <button @click="comment_send">发送</button>
        <img src="@/assets/icon/face.png">
      </p>
    </x-dialog>
  </div>
</div>
</template>

<script>
import { Previewer, TransferDom, Popover, XDialog } from 'vux'
import { Scroller } from 'vux'
import { init_list, click_good, to_comment } from '@/api/dynamic'
import {dateFtt} from '@/utils/base'
export default {
  name: 'news',
  directives: {
    TransferDom
  },
  components: {
    Previewer,
    Popover,
    XDialog,
    Scroller
  },
  data () {
    return {
      commentDialog: false, // 评论dialog
      pic_list: [],
      options: {
        getThumbBoundsFn (index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
          // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect()
          // w = width
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      },
      pullup_config: {
        content: '加载中...',
        pullUpHeight: 60,
        height: 40,
        autoRefresh: false,
        downContent: '加载中...',
        upContent: '加载中...',
        loadingContent: '加载中...'
      },
      page: 1,
      pagesize: 10,
      max_page: 0,
      data_list: [],
      test: [1, 2, 3, 4],
      isAjax: true,
      scrollerStatus: {
        pullupStatus: 'default'
      },
      comment_obj: null, // 品论的中专对象
      comment_content: '',
      comment_index: null
    }
  },
  methods: {
    logIndexChange (arg) {
      console.log(arg)
    },

    show (img_item) {
      const list = this.pic_list
      let index = null
      for (let i = 0; i < list.length; i++) {
        if (img_item.id === list[i].id) {
          index = i
        }
      }
      if (index != null) {
        this.$refs.previewer.show(index)
      }
    },

    loadMore () {
      if (this.isAjax && this.page < this.max_page) {
        this.page++
        this.get_list()
      } else if (this.page >= this.max_page) {
        this.$refs.scrollerBottom.disablePullup() // 禁用上拉
      }
    },

    get_list () {
      this.isAjax = false
      init_list({
        page: this.page,
        pagesize: this.pagesize
      }).then((e) => {
        this.isAjax = true
        if (e.data && e.data.rows && e.data.rows instanceof Array) {
          let list = e.data.rows
          let max_page = Math.ceil(e.data.total / 10)
          list.map((val, i) => {
            // 公司动态就一张图片
            if (typeof val.cover === 'string' && val.cover != '') {
              const id = Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36)
              const con = {
                id,
                src: val.cover
              }
              val.cover = [con]
              this.pic_list.push(con)
            } else if (val.cover instanceof Array && val.cover.length > 0) {
              let arr = []
              val.cover.map((data, i) => {
                const id = Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36)
                const obj = {
                  id,
                  src: data
                }
                this.pic_list.push(obj)
                arr.push(obj)
              })
              val.cover = arr
            }

            // 处理时间
            val.time = dateFtt('yyyy-MM-dd hh:mm:ss', new Date(val.create_time * 1000))

            // 点赞开关
            val.comment_two = false
          })

          this.data_list = this.data_list.concat(list)
          //this.data_list = []
          this.total = e.data.total
          this.max_page = Math.ceil(e.data.total / 10)
          this.$nextTick(() => {
            this.$refs.scrollerBottom.donePullup()// 上啦完成
            this.$refs.scrollerBottom.donePulldown()// 下拉完成
            this.$refs.scrollerBottom.reset()

            if (this.max_page == 1 || this.data_list.length === 0) {
              this.$refs.scrollerBottom.disablePullup()// 禁止上啦
            } else {
              this.$refs.scrollerBottom.enablePullup()// 恢复上啦
            }
          })

          console.log(this.data_list)
        }
      }).catch((err) => {
        console.log(err)
        this.isAjax = true
      })
    },

    Refresh () {
      if (this.isAjax) {
        // 重置
        this.data_list = []
        this.pic_list = []
        this.page = 1
        this.total = 0
        this.max_page = 0
        this.$refs.scrollerBottom.disablePullup() // 禁用上拉
        this.get_list()
      }
    },

    good (item, i) {
      const is_zan = item.praise.is_praise
      const id = item.id
      if (is_zan == 1) {
        alert('已点赞，不能再次点赞！')
        return
      }
      click_good({id}).then((ev) => {
        if (ev.code == 200) {
          this.data_list[i].praise.is_praise = 1
          const obj = {
            user_image: this.$store.state.user.info.image,
            user_name: this.$store.state.user.info.username
          }
          this.data_list[i].praise.rows.push(obj)
        }
      })
    },

    dialog_hide () {
      this.comment_obj = null
      this.comment_content = ''
      this.comment_index = null
    },

    open_commentDialog (item, i) {
      this.commentDialog = true
      this.comment_obj = item
      this.comment_index = i
    },

    // 评论发送
    comment_send () {
      if (this.comment_obj === null || this.comment_index === null) {
        alert('评论发生错误，请重新操作！')
        this.commentDialog = false
        return
      }
      if (this.comment_content === '') {
        alert('评论内容不能为空！')
        return
      }

      const dynamic_id = this.comment_obj.id
      const content = this.comment_content
      to_comment({
        dynamic_id,
        content
      }).then((e) => {
        if (e.code === 200) {
          const obj = {
            user_image: this.$store.state.user.info.image,
            user_name: this.$store.state.user.info.username,
            content
          }
          this.data_list[this.comment_index].comment.rows.push(obj)
          this.commentDialog = false
          this.dialog_hide()
        } else {
          alert('评论发生错误，请重新操作！')
          this.commentDialog = false
          this.dialog_hide()
        }
      }).catch(() => {
        alert('评论发生错误，请重新操作！')
        this.commentDialog = false
        this.dialog_hide()
      })
    },

    to_publish () {
      this.$router.push({
        path: '/newsPublish'
      })
    },

    to_details (item) {
      this.$router.push({
        path: '/companyDetails',
        query: {
          id: item.id
        }

      })
    }

  },
  mounted () {
    this.get_list()
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.news{
  height: 100%;
  overflow: auto;
  .scroller_frame{
    padding-bottom:0.3rem;
  }
  .header{
    height: 3rem;
    background: url('~@/assets/img/tabbar.png') no-repeat  top;
    background-size: contain;
    position: relative;
    img{
      position: absolute;
      top: 1rem;
      left: 1rem;
      width: 1.6rem;
      height: 1.6rem;
    }
    p{
      text-align: center;
      font-size: 0.36rem;
      color: #717171;
      position: absolute;
      bottom: 0.5rem;
      width: 100%;
    }
    & > i{
      position: absolute;
      right: 0.3rem;
      bottom: 0.5rem;
      border-radius: 0.7rem;
      height: 0.7rem;
      width: 0.7rem;
      border: 1px solid #5977fe;
      text-align: center;
      line-height: 0.95rem;
      .vux-x-icon{
        width: 0.5rem;
        fill: #5977fe;
        height: 0.5rem;
      }
    }
  }
  .news-list{
    position: relative;
    padding-left: 1.5rem;
    padding-right: 0.3rem;
    margin-top: 0.4rem;
    &>.emotion{
      position: absolute;
      top: 0;
      left: 0.3rem;
      width: 1rem;
      height: 1rem;
      border-radius: 0.1rem;
    }
    .title{
      .name{
        font-size: 0.32rem;
        font-weight: bold;
      }
      .tag{
        border: 1px solid #5977fe;
        color: #5977fe;
        font-size: 0.22rem;
        height: 0.35rem;
        line-height: 0.36rem;
        border-radius: 0.35rem;
        padding: 0 0.2rem;
        display: inline-block;
        margin-left: 0.5rem;
      }
      .time{
        font-size: 0.24rem;
        color: #717171;
        float: right;
        text-decoration: underline;
      }
    }
    .content{
      & > p{
        font-size: 0.28rem;
        color: #717171;
        margin: 0.2rem 0;
      }
      .img-wrap{
        width: 33%;
        float: left;
        height: 1.5rem;
        overflow: hidden;
        text-align: center;
        padding-right: 0.05rem;
        padding-bottom: 0.05rem;
        background-color: #fff;
        img{
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      }
      .img-one{
        width: 4rem;
        display: inline-block;
        img{
          width: 100%;
          margin-top: 0.2rem;
        }
      }
    }
    .comment{
      .icon-time{
        margin-top: 0.5rem;
        height: 0.6rem;
        line-height: 0.6rem;
        .comment-icon{
          width: 0.4rem;
          margin-top: 0.1rem;
        }
      }
      .comment-content{
        background-color: #f5f5f5;
        border-radius: 0.1rem;
        margin-top: 0.2rem;

      }
      .comment-zan{
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.1rem;

        .heart{
          width: 0.4rem;
          margin-left: 0.1rem;
          margin-top: 0.1rem;
          float: left;
        }
        &>span{
          display: inline-block;
          height: 0.5rem;
          margin-left: 0.1rem;
          margin-bottom: 0.1rem;
          img{
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 0.1rem;
          }
          i{
            float: right;
            margin-top: 0.15rem;
            margin-left: 0.1rem;
          }
        }
      }
      li{
        border-bottom: 1px solid #ddd;
        padding: 0.25rem;
        min-height: 1.1rem;
        position: relative;
        padding-left: 1rem;
        &:last-child{
          border: none;
        }
        img{
          position: absolute;
          top: 0.25rem;
          left: 0.25rem;
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 0.1rem;
        }
        p{
          span{
            font-size: 0.24rem;
            color: #717171;
            margin-right: 0.2rem;
          }
          font-size: 0.22rem;
          color: #717171;
        }
      }
    }
  }
}
.popover-content{
  padding: 0.15rem 0;
  height: 0.75rem;
  span{
    float: left;
    width: 1.6rem;
    padding-left: 0.3rem;
    &:first-child{
      border-right: 1px solid #fff;
      margin-top: 1px;
    }
  }
  img{
    width: 0.4rem;
    float: left;
    margin-right: 0.1rem;
  }
}
.dialog-comment{
  padding: 0.2rem;
  input{
    outline: none;
    border: none;
    height: 0.6rem;
    float: left;
    width: calc(100% - 1.6rem);
    border-bottom: 1px solid #ddd;
  }
  img{
    width: 0.4rem;
    height: 0.4rem;
    float: right;
    margin-top: 0.1rem;
    margin-right: 0.2rem;
  }
  button{
    float: right;
    outline: none;
    border: none;
    height: 0.6rem;
    background-color: #fff;
    border: 1px solid #5977fe;
    width: 0.8rem;
    border-radius: 0.1rem;
    color: #717171;
  }
}
.dialog{
  & /deep/ .weui-dialog{
    width: 100%;
    max-width: 100%;
  }
}
</style>
