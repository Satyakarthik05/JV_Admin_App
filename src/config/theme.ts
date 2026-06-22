export const fonts = {
  primary: 'times-new-roman',
  secondry: 'Arial',
  title: 'DMSans-Bold',
  subTitle: 'DMSans-Regular',
  dmSans: 'DM Sans',
  textInput: "DMSans-Medium",
  textFont: "DMSans-Regular",
  sfbold: 'SF-Pro-Display-Bold',
  sfmedium: 'SF-Pro-Display-Medium',
  sfregular: 'SF-Pro-Display-Regular',
};

export const lightTheme = {
  primary: '#064081',        // Main brand color
  secondry: '#02B0E8',       // Accent color
  text: '#414042',           // Default text color

  homeblue: '#2B7FFF',
  homegreen: '#00C950',
  homedarkyellow: '#FF6900',
  homeviolate: '#D100CD',
  foundationgray: '#4A5565',
  foundationgraynew: '#1A1E23',

  hrhomeviolate: "#FAF5FF",
  hrhomegreen: "#F0FDF4",
  hrhomenewviolet: "#FDF2F8",
  hrhomeyellow: "#FFFBDF",
  hrhomeprofile: "#f17a78ff",
  lightpink: '#FFE6E6',




  // Additional extracted colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#CCCCCC',
  darkGray: '#525252',
  lightGray: '#E0E0E0',
  iconGray: '#3D3D3D',
  error: 'red',
  buttonOrange: '#FF9500',
  simpleblack: '#101828',
  commoncolor: '#EF3D3B',
  commonred: '#E53935',
  commomcolorlight: '#FEF3F3',
  graynew: '#6A7282',
  btntextgreen: '#008236',
  btnbggreen: '#DCFCE7',
  editiconclr: '#00AD41',
  formtitlegry: '#3E4851',
  inputfieldborder: '#B7BCC8',
  inputfieldcolor: '#8991A6',
  graynewversion: '#364153',
  lightbordercolor: '#E5E7EB',
  lightskyblue: '#EFF6FF',
  lightredcolor: '#FEF2F2',
  verylightredcolor: '#FEFCE8',
  togglegray: '#E8ECF2',
  darkviolet: '#8200DB',
  lightviolet: '#F3E8FF',
  halfdayclr: '#CA3500',
  halfdaybg: '#FFEDD4',
  simpleviolet: '#9810FA',
  simplegreen: '#00A63E',
  homepink: '#E60076',
  smallgray: '#776e6e55',
  dateColor: '#82889A',
  goodsblack: '#1A1A1a',
  lockblue: '#155DFC',
  simpleredborder: '#FFC9C9',
  thickred: '#E7000B',
  lightgray: '#EFEFEF',
  lightcolor: '#99A1AF',
  togleGreen: '#DEFFEB',
  placeholdertextColor: "#888",


};

export const darkTheme = {
  primary: '#064081',
  secondry: '#02B0E8',
  text: '#FFFFFF',

  // Same colors for dark mode (can be customized differently later)
  white: '#FFFFFF',
  black: '#000000',
  gray: '#CCCCCC',
  darkGray: '#525252',
  lightGray: '#E0E0E0',
  iconGray: '#3D3D3D',
  error: 'red',
  buttonOrange: '#FF9500',
  simpleblack: '#101828',
  commoncolor: '#EF3D3B',
  commomcolorlight: '#FEF3F3',
  graynew: '#6A7282',
  btntextgreen: '#008236',
  btnbggreen: '#DCFCE7',
  editiconclr: '#00AD41',
  formtitlegry: '#3E4851',
  inputfieldborder: '#B7BCC8',
  inputfieldcolor: '#8991A6',
  graynewversion: '#364153',
  lightbordercolor: '#E5E7EB',
  lightskyblue: '#EFF6FF',
  lightredcolor: '#FEF2F2',
  verylightredcolor: '#FEFCE8',
  foundationgray: '#4A5565',
  togglegray: '#E8ECF2',
  placeholdertextColor: "#888",


  homeblue: '#2B7FFF',
  homegreen: '#00C950',
  homedarkyellow: '#FF6900',
  homeviolate: '#D100CD',


  hrhomeviolate: "#FAF5FF",
  hrhomegreen: "#F0FDF4",
  hrhomenewviolet: "#FDF2F8",
  hrhomeyellow: "#FFFBDF",
  hrhomeprofile: "#f17a78ff",

  darkviolet: '#8200DB',
  lightviolet: '#F3E8FF',

  halfdayclr: '#CA3500',
  halfdaybg: '#FFEDD4',
  simpleviolet: '#9810FA',
  simplegreen: '#00A63E',
  homepink: '#E60076',
  smallgray: '#776e6e55',
  dateColor: '#82889A',
  goodsblack: '#1A1A1a',
  lockblue: '#155DFC',
  simpleredborder: '#FFC9C9',
  thickred: '#E7000B',
  lightgray: '#EFEFEF',
  lightcolor: '#99A1AF',
  togleGreen: '#DEFFEB',
  lightpink: '#FFE6E6',












};

// Theme switcher
const isDarkMode = false; // Replace with Redux or context-based check
export const colors = isDarkMode ? darkTheme : lightTheme;