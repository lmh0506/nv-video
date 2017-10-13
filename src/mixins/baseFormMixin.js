import Yzm from '@/base/yzm'
import {_checkPassWord} from '@/util/check'

export const baseFormMixin = {
  data () {
    const _checkYzm = (rule, value, callback) => {
      // 判断验证码是否为空
      if (!value) {
        return callback(new Error('请输入验证码'))
      } else if (!this.isOk) {
        return callback(new Error('验证码错误'))
      } else {
        callback()
      }
    }

    return {
      ruleForm: {
        userName: '', // 用户名
        passWord: '', // 密码
        yzm: '' // 输入的验证码
      },
      rules: {
        passWord: [
          {validator: _checkPassWord, trigger: 'blur'}
        ],
        yzm: [
          {validator: _checkYzm, trigger: 'blur'}
        ]
      },
      picText: '' // 获取的验证码
    }
  },
  computed: {
    // 校验验证码是否正确
    isOk () {
      return this.picText.toLowerCase() === this.ruleForm.yzm.toLowerCase()
    }
  },
  methods: {
    // 获取验证码的值
    draw (picText) {
      this.$nextTick(() => {
        this.picText = picText
      })
    }
  },
  components: {
    Yzm
  }
}
