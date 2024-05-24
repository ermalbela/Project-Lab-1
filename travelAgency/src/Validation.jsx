export const patterns = {
  email: /^([a-zA-Z0-9_\-.])+@([a-zA-Z0-9])+.[a-z]{2,5}$/,
  name: /^[a-zA-Z0-9]+?\s?[a-zA-Z0-9]+?\s?[a-zA-Z0-9]+$/,
  password: /^[a-zA-Z0-9!.@#$%^&*]{6,26}$/,
  fiskalNumber: /^[+]?[(]?[0-9a-z]{3}[)]?[-\s.]?[0-9a-z]{3}[-\s.]?[a-z0-9]{1,6}$/,
  phoneNumber: /[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{3,6}$/,
  city: /^[a-zA-Z]+?\s?[a-zA-Z]+?\s?[a-zA-Z]+$/,
  address: /^[a-zA-Z0-9]+?\s?[a-zA-Z0-9]+?(\s[a-zA-Z]{1,3}.[0-9]{1,3})?$/,
  userName: /^[a-zA-Z0-9]+?\s?[a-zA-Z0-9]+$/,
  date: /^\d{4}\/\d{2}\/\d{2}$/
}