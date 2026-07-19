// Vietnam locations with coordinates
export interface Ward {
  name: string
  lat: number
  lng: number
}

export interface District {
  name: string
  lat: number
  lng: number
  wards: Ward[]
}

export interface Province {
  id: number
  name: string
  lat: number
  lng: number
  districts: District[]
}

export const VIETNAM_LOCATIONS: Province[] = [
  {
    id: 1,
    name: 'Hà Nội',
    lat: 20.9955,
    lng: 105.8581,
    districts: [
      {
        name: 'Ba Đình',
        lat: 21.0235,
        lng: 105.8343,
        wards: [
          { name: 'Phường Phúc Xá', lat: 21.0245, lng: 105.8353 },
          { name: 'Phường Quán Thánh', lat: 21.0225, lng: 105.8333 },
          { name: 'Phường Trúc Bạch', lat: 21.0215, lng: 105.8323 },
        ],
      },
      {
        name: 'Hoàn Kiếm',
        lat: 21.0285,
        lng: 105.8549,
        wards: [
          { name: 'Phường Hàng Bạc', lat: 21.0295, lng: 105.8559 },
          { name: 'Phường Hàng Gai', lat: 21.0275, lng: 105.8539 },
          { name: 'Phường Hàng Mã', lat: 21.0265, lng: 105.8529 },
        ],
      },
      {
        name: 'Tây Hồ',
        lat: 21.0621,
        lng: 105.8317,
        wards: [
          { name: 'Phường Quảng An', lat: 21.0631, lng: 105.8327 },
          { name: 'Phường Tây Hồ', lat: 21.0611, lng: 105.8307 },
        ],
      },
      {
        name: 'Cầu Giấy',
        lat: 21.0022,
        lng: 105.7894,
        wards: [
          { name: 'Phường Dịch Vọng', lat: 21.0032, lng: 105.7904 },
          { name: 'Phường Yên Hòa', lat: 21.0012, lng: 105.7884 },
          { name: 'Phường Trung Hòa', lat: 21.0002, lng: 105.7874 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'TP. Hồ Chí Minh',
    lat: 10.7769,
    lng: 106.7009,
    districts: [
      {
        name: 'Quận 1',
        lat: 10.7769,
        lng: 106.7009,
        wards: [
          { name: 'Phường Bến Nghé', lat: 10.7779, lng: 106.7019 },
          { name: 'Phường Bến Thành', lat: 10.7759, lng: 106.6999 },
          { name: 'Phường Đakao', lat: 10.7749, lng: 106.6989 },
        ],
      },
      {
        name: 'Quận 2',
        lat: 10.7938,
        lng: 106.7466,
        wards: [
          { name: 'Phường An Khánh', lat: 10.7948, lng: 106.7476 },
          { name: 'Phường An Lợi Đông', lat: 10.7928, lng: 106.7456 },
          { name: 'Phường Bình Khánh', lat: 10.7918, lng: 106.7446 },
        ],
      },
      {
        name: 'Quận 3',
        lat: 10.7894,
        lng: 106.6892,
        wards: [
          { name: 'Phường 1', lat: 10.7904, lng: 106.6902 },
          { name: 'Phường 2', lat: 10.7884, lng: 106.6882 },
          { name: 'Phường 3', lat: 10.7874, lng: 106.6872 },
        ],
      },
      {
        name: 'Quận 4',
        lat: 10.7523,
        lng: 106.7065,
        wards: [
          { name: 'Phường 1', lat: 10.7533, lng: 106.7075 },
          { name: 'Phường 2', lat: 10.7513, lng: 106.7055 },
        ],
      },
      {
        name: 'Quận 5',
        lat: 10.7597,
        lng: 106.6628,
        wards: [
          { name: 'Phường 1', lat: 10.7607, lng: 106.6638 },
          { name: 'Phường 2', lat: 10.7587, lng: 106.6618 },
        ],
      },
      {
        name: 'Quận 7',
        lat: 10.7326,
        lng: 106.7316,
        wards: [
          { name: 'Phường 1', lat: 10.7336, lng: 106.7326 },
          { name: 'Phường 2', lat: 10.7316, lng: 106.7306 },
        ],
      },
      {
        name: 'Bình Thạnh',
        lat: 10.8109,
        lng: 106.7282,
        wards: [
          { name: 'Phường 1', lat: 10.8119, lng: 106.7292 },
          { name: 'Phường 2', lat: 10.8099, lng: 106.7272 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Hải Phòng',
    lat: 20.8449,
    lng: 106.6881,
    districts: [
      {
        name: 'Hồng Bàng',
        lat: 20.8449,
        lng: 106.6881,
        wards: [
          { name: 'Phường Hồng Bàng', lat: 20.8459, lng: 106.6891 },
          { name: 'Phường Minh Khai', lat: 20.8439, lng: 106.6871 },
        ],
      },
      {
        name: 'Ngô Quyền',
        lat: 20.8569,
        lng: 106.6841,
        wards: [
          { name: 'Phường Ngô Quyền', lat: 20.8579, lng: 106.6851 },
          { name: 'Phường Lạch Tray', lat: 20.8559, lng: 106.6831 },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Đà Nẵng',
    lat: 16.0544,
    lng: 108.2022,
    districts: [
      {
        name: 'Hải Châu',
        lat: 16.0544,
        lng: 108.2022,
        wards: [
          { name: 'Phường Hải Châu 1', lat: 16.0554, lng: 108.2032 },
          { name: 'Phường Hải Châu 2', lat: 16.0534, lng: 108.2012 },
        ],
      },
      {
        name: 'Thanh Khê',
        lat: 16.0644,
        lng: 108.2122,
        wards: [
          { name: 'Phường Thanh Khê', lat: 16.0654, lng: 108.2132 },
          { name: 'Phường An Khê', lat: 16.0634, lng: 108.2112 },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'Cần Thơ',
    lat: 10.0282,
    lng: 105.7645,
    districts: [
      {
        name: 'Ninh Kiều',
        lat: 10.0282,
        lng: 105.7645,
        wards: [
          { name: 'Phường Ninh Kiều', lat: 10.0292, lng: 105.7655 },
          { name: 'Phường Cái Khế', lat: 10.0272, lng: 105.7635 },
        ],
      },
      {
        name: 'Bình Thủy',
        lat: 10.0082,
        lng: 105.7845,
        wards: [
          { name: 'Phường Bình Thủy', lat: 10.0092, lng: 105.7855 },
          { name: 'Phường Long Hưng', lat: 10.0072, lng: 105.7835 },
        ],
      },
    ],
  },
]

export function getDistrictsByProvince(provinceName: string): District[] {
  const province = VIETNAM_LOCATIONS.find(p => p.name === provinceName)
  return province?.districts || []
}

export function getWardsByDistrict(provinceName: string, districtName: string): Ward[] {
  const province = VIETNAM_LOCATIONS.find(p => p.name === provinceName)
  const district = province?.districts.find(d => d.name === districtName)
  return district?.wards || []
}

export function getLocationCoordinates(provinceName: string, districtName?: string, wardName?: string) {
  const province = VIETNAM_LOCATIONS.find(p => p.name === provinceName)
  if (!province) return { lat: 20.9955, lng: 105.8581 }

  if (!districtName) {
    return { lat: province.lat, lng: province.lng }
  }

  const district = province.districts.find(d => d.name === districtName)
  if (!district) return { lat: province.lat, lng: province.lng }

  if (!wardName) {
    return { lat: district.lat, lng: district.lng }
  }

  const ward = district.wards.find(w => w.name === wardName)
  if (!ward) return { lat: district.lat, lng: district.lng }

  return { lat: ward.lat, lng: ward.lng }
}
