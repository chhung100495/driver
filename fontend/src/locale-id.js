function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const messages = {
  required: (field) => {
    return `Vui lòng nhập ${field}.`
  },
  confirmed: (field, [confirmedField]) => capitalizeFirstLetter(field) + ` phải giống với ${confirmedField}.`,
};

const attributes = {
  username: 'tên đăng nhập',
  password: 'mật khẩu',
  txtPassword: 'mật khẩu',
  retype: 'mật khẩu xác nhận',
}

const locale = {
    name: 'id',
    messages,
    attributes
};

export default locale;