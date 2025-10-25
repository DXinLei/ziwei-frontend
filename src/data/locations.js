// 中国省市区数据（简化版）
export const locationData = [
  {
    name: '北京市',
    value: 'beijing',
    children: [
      {
        name: '北京市',
        value: 'beijing-city',
        children: [
          { name: '东城区', value: 'dongcheng' },
          { name: '西城区', value: 'xicheng' },
          { name: '朝阳区', value: 'chaoyang' },
          { name: '丰台区', value: 'fengtai' },
          { name: '石景山区', value: 'shijingshan' },
          { name: '海淀区', value: 'haidian' },
          { name: '门头沟区', value: 'mentougou' },
          { name: '房山区', value: 'fangshan' },
          { name: '通州区', value: 'tongzhou' },
          { name: '顺义区', value: 'shunyi' },
          { name: '昌平区', value: 'changping' },
          { name: '大兴区', value: 'daxing' },
          { name: '怀柔区', value: 'huairou' },
          { name: '平谷区', value: 'pinggu' },
          { name: '密云区', value: 'miyun' },
          { name: '延庆区', value: 'yanqing' }
        ]
      }
    ]
  },
  {
    name: '上海市',
    value: 'shanghai',
    children: [
      {
        name: '上海市',
        value: 'shanghai-city',
        children: [
          { name: '黄浦区', value: 'huangpu' },
          { name: '徐汇区', value: 'xuhui' },
          { name: '长宁区', value: 'changning' },
          { name: '静安区', value: 'jingan' },
          { name: '普陀区', value: 'putuo' },
          { name: '虹口区', value: 'hongkou' },
          { name: '杨浦区', value: 'yangpu' },
          { name: '闵行区', value: 'minhang' },
          { name: '宝山区', value: 'baoshan' },
          { name: '嘉定区', value: 'jiading' },
          { name: '浦东新区', value: 'pudong' },
          { name: '金山区', value: 'jinshan' },
          { name: '松江区', value: 'songjiang' },
          { name: '青浦区', value: 'qingpu' },
          { name: '奉贤区', value: 'fengxian' },
          { name: '崇明区', value: 'chongming' }
        ]
      }
    ]
  },
  {
    name: '广东省',
    value: 'guangdong',
    children: [
      {
        name: '广州市',
        value: 'guangzhou',
        children: [
          { name: '荔湾区', value: 'liwan' },
          { name: '越秀区', value: 'yuexiu' },
          { name: '海珠区', value: 'haizhu' },
          { name: '天河区', value: 'tianhe' },
          { name: '白云区', value: 'baiyun' },
          { name: '黄埔区', value: 'huangpu' },
          { name: '番禺区', value: 'panyu' },
          { name: '花都区', value: 'huadu' },
          { name: '南沙区', value: 'nansha' },
          { name: '从化区', value: 'conghua' },
          { name: '增城区', value: 'zengcheng' }
        ]
      },
      {
        name: '深圳市',
        value: 'shenzhen',
        children: [
          { name: '罗湖区', value: 'luohu' },
          { name: '福田区', value: 'futian' },
          { name: '南山区', value: 'nanshan' },
          { name: '宝安区', value: 'baoan' },
          { name: '龙岗区', value: 'longgang' },
          { name: '盐田区', value: 'yantian' },
          { name: '龙华区', value: 'longhua' },
          { name: '坪山区', value: 'pingshan' },
          { name: '光明区', value: 'guangming' }
        ]
      },
      {
        name: '珠海市',
        value: 'zhuhai',
        children: [
          { name: '香洲区', value: 'xiangzhou' },
          { name: '斗门区', value: 'doumen' },
          { name: '金湾区', value: 'jinwan' }
        ]
      }
    ]
  },
  {
    name: '四川省',
    value: 'sichuan',
    children: [
      {
        name: '成都市',
        value: 'chengdu',
        children: [
          { name: '锦江区', value: 'jinjiang' },
          { name: '青羊区', value: 'qingyang' },
          { name: '金牛区', value: 'jinniu' },
          { name: '武侯区', value: 'wuhou' },
          { name: '成华区', value: 'chenghua' },
          { name: '龙泉驿区', value: 'longquanyi' },
          { name: '青白江区', value: 'qingbaijiang' },
          { name: '新都区', value: 'xindu' },
          { name: '温江区', value: 'wenjiang' },
          { name: '双流区', value: 'shuangliu' },
          { name: '郫都区', value: 'pidu' },
          { name: '新津区', value: 'xinjin' }
        ]
      },
      {
        name: '绵阳市',
        value: 'mianyang',
        children: [
          { name: '涪城区', value: 'fucheng' },
          { name: '游仙区', value: 'youxian' },
          { name: '安州区', value: 'anzhou' }
        ]
      }
    ]
  },
  {
    name: '浙江省',
    value: 'zhejiang',
    children: [
      {
        name: '杭州市',
        value: 'hangzhou',
        children: [
          { name: '上城区', value: 'shangcheng' },
          { name: '拱墅区', value: 'gongshu' },
          { name: '西湖区', value: 'xihu' },
          { name: '滨江区', value: 'binjiang' },
          { name: '萧山区', value: 'xiaoshan' },
          { name: '余杭区', value: 'yuhang' },
          { name: '临平区', value: 'linping' },
          { name: '钱塘区', value: 'qiantang' },
          { name: '富阳区', value: 'fuyang' },
          { name: '临安区', value: 'linan' }
        ]
      },
      {
        name: '宁波市',
        value: 'ningbo',
        children: [
          { name: '海曙区', value: 'haishu' },
          { name: '江北区', value: 'jiangbei' },
          { name: '北仑区', value: 'beilun' },
          { name: '镇海区', value: 'zhenhai' },
          { name: '鄞州区', value: 'yinzhou' },
          { name: '奉化区', value: 'fenghua' }
        ]
      }
    ]
  },
  {
    name: '江苏省',
    value: 'jiangsu',
    children: [
      {
        name: '南京市',
        value: 'nanjing',
        children: [
          { name: '玄武区', value: 'xuanwu' },
          { name: '秦淮区', value: 'qinhuai' },
          { name: '建邺区', value: 'jianye' },
          { name: '鼓楼区', value: 'gulou' },
          { name: '浦口区', value: 'pukou' },
          { name: '栖霞区', value: 'qixia' },
          { name: '雨花台区', value: 'yuhuatai' },
          { name: '江宁区', value: 'jiangning' },
          { name: '六合区', value: 'liuhe' },
          { name: '溧水区', value: 'lishui' },
          { name: '高淳区', value: 'gaochun' }
        ]
      },
      {
        name: '苏州市',
        value: 'suzhou',
        children: [
          { name: '虎丘区', value: 'huqiu' },
          { name: '吴中区', value: 'wuzhong' },
          { name: '相城区', value: 'xiangcheng' },
          { name: '姑苏区', value: 'gusu' },
          { name: '吴江区', value: 'wujiang' }
        ]
      }
    ]
  }
]