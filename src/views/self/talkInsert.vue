/*
 * @Author: kaker.xutianxing
 * @Date: 2018-09-06 15:14:03
 * @Last Modified by: kaker.xutianxing
 * @Last Modified time: 2018-09-29 11:22:29
 */
<template>
  <div class="insert-talk">
    <div class="tag clearfix">
      <p>添加关键词</p>
      <span v-for="(item, index) in tagList" :key="index">{{item}}<x-icon type="ios-minus" class="icon-delete" @click.native="deleteTag(index)"></x-icon></span>
      <x-icon type="ios-plus-empty" class="icon-insert fl" @click.native="openDialog"></x-icon>
    </div>
    <group title="编写话术" class='bgColor'>
      <x-textarea v-model="content" :show-counter="true" :max="200" autosize placeholder="请输入内容"></x-textarea>
    </group>
    <p class="btn">
      <x-button type="primary" @click.native="save">保存</x-button>
    </p>
    <x-dialog v-model="tagDialog" :hide-on-blur="true">
      <div class="dialog-tag">
        <h5>添加关键词</h5>
        <group>
        <x-input placeholder="10个字以内" :max="10" v-model="tag"></x-input>
        </group>
        <p><button @click="closeDialog">取消</button><button @click="insertTag">确定</button></p>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { Group, XTextarea, XButton, XDialog, XInput, AlertModule } from 'vux'
import { talkSave } from '@/api/talk'

export default {
  name: 'talkInsert',
  components: {
    Group,
    XTextarea,
    XDialog,
    XInput,
    XButton
  },
  data () {
    return {
      content: '',
      tagList: [],
      tag: '',
      tagDialog: false,
      group_id: this.$route.query.groupId
    }
  },
  methods: {
    save () {
      if (this.content === '') {
        AlertModule.show({
          title: '提示',
          content: '话术内容不能为空'
        })
        return false
      }
      if (this.tagList.length <= 0) {
        AlertModule.show({
          title: '提示',
          content: '标签不能为空'
        })
        return false
      }
      const data = {
        group_id: this.group_id,
        content: this.content,
        keyword: this.tagList.join(',')
      }
      talkSave(data)
        .then(res => {
          this.$router.back(-1)
        })
    },
    openDialog () {
      this.tagDialog = true
      this.tag = ''
    },
    closeDialog () {
      this.tagDialog = false
    },
    insertTag () {
      this.tagList.push(this.tag)
      this.closeDialog()
    },
    deleteTag (index) {
      this.tagList.splice(index, 1)
    }
  },
  mounted () {}
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
.insert-talk {
  overflow: auto;
  height: 100%;
  .tag {
    // color: #717171;
    color: #999999;
    padding: 0.4rem;
    border-bottom: 1px solid #eee;
    p {
      font-size: 0.32rem;
      margin-bottom: 0.2rem;
      // color:
    }
    span {
      font-size: 0.28rem;
      float: left;
      margin-right: 0.5rem;
      position: relative;
      height: 0.6rem;
      border-radius: 0.6rem;
      border: 1px solid #ddd;
      padding: 0 0.2rem;
      line-height: 0.55rem;
      margin-bottom: 0.2rem;
      .icon-delete {
        fill: red;
        width: 0.3rem;
        position: absolute;
        top: -0.2rem;
        right: -0.1rem;
      }
    }
    .icon-insert {
      height: 0.6rem;
      border-radius: 0.6rem;
      border: 1px solid #ddd;
      width: 1.6rem;
      fill: #717171;
    }
  }
  & /deep/ .weui-cells__title {
    font-size: 0.32rem;
  }
  & /deep/ .bgColor .weui-cells {
    &::after {
      border: none;
    }
    &::before {
      border: none;
    }
    .weui-cell__bd {
      border: 1px solid #eee;
      background: #fbfbfb;
      padding: 10px;
      padding-bottom: 0;
    }
    textarea {
      font-size: 0.3rem;
      color: #717171;
      background: #fbfbfb;
    }
  }
  .btn {
    margin-top: 1rem;
    padding: 0 1rem;
  }
}
.dialog-tag {
  padding: 0.3rem;
  h5 {
    font-size: 0.32rem;
    color: #717171;
    margin-bottom: 0.3rem;
  }
  p {
    margin-top: 0.3rem;
    button {
      margin-right: 0.2rem;
      height: 0.6rem;
      width: 1.8rem;
      border-radius: 0.6rem;
      border: none;
      outline: none;
      font-size: 0.32rem;
      &:first-child {
        background: #fff;
        border: 1px solid #ddd;
        color: #717171;
      }
      &:last-child {
        background: #5977fe;
        color: #fff;
      }
    }
  }
  & /deep/ .weui-cells__title {
    font-size: 0.32rem;
  }
  & /deep/ .weui-cells {
    &::after {
      border: none;
    }
    &::before {
      border: none;
    }
    .weui-cell__bd {
      background: #fbfbfb;
      padding: 10px 0;
    }
    input {
      font-size: 0.3rem;
      color: #717171;
    }
  }
}
</style>
