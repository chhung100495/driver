const messages = {
  required: (field) => {
    return `Vui lòng nhập ${field}`
  },
};

const attributes = {
  username: 'tên đăng nhập',
  password: 'mật khẩu'
}

const locale = {
    name: 'id',
    messages,
    attributes
};

export default locale;