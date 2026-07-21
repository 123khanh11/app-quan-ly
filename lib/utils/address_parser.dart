// Utility để parse và xử lý địa chỉ giao hàng

class ParsedAddress {
  final String detailedAddress;
  final String ward;
  final String district;
  final String province;

  ParsedAddress({
    required this.detailedAddress,
    required this.ward,
    required this.district,
    required this.province,
  });

  /// Trả về địa chỉ đầy đủ: "Tỉnh - Quận - Xã"
  String getFullAddressSummary() {
    final parts = <String>[];
    if (province.isNotEmpty) parts.add(province);
    if (district.isNotEmpty) parts.add(district);
    if (ward.isNotEmpty) parts.add(ward);
    return parts.join(' - ');
  }

  /// Trả về dòng cơ sở: "Quận - Xã"
  String getDistrictWardSummary() {
    final parts = <String>[];
    if (district.isNotEmpty) parts.add(district);
    if (ward.isNotEmpty) parts.add(ward);
    return parts.join(' - ');
  }
}

/// Parse địa chỉ giao hàng từ string
/// Format: "detailedAddress, ward, district, province"
/// 
/// Ví dụ:
/// "Số 123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
/// 
/// Kết quả:
/// ParsedAddress(
///   detailedAddress: "Số 123 Đường Lê Lợi",
///   ward: "Phường Bến Thành",
///   district: "Quận 1",
///   province: "TP. Hồ Chí Minh",
/// )
ParsedAddress parseShippingAddress(String? shippingAddress) {
  if (shippingAddress == null || shippingAddress.isEmpty) {
    return ParsedAddress(
      detailedAddress: '',
      ward: '',
      district: '',
      province: '',
    );
  }

  // Format: "detailedAddress, ward, district, province"
  final parts = shippingAddress.split(', ');
  return ParsedAddress(
    detailedAddress: parts.isNotEmpty ? parts[0].trim() : '',
    ward: parts.length > 1 ? parts[1].trim() : '',
    district: parts.length > 2 ? parts[2].trim() : '',
    province: parts.length > 3 ? parts[3].trim() : '',
  );
}

/// Tạo địa chỉ từ các phần riêng biệt
String buildShippingAddress({
  required String detailedAddress,
  required String ward,
  required String district,
  required String province,
}) {
  final parts = <String>[];
  if (detailedAddress.isNotEmpty) parts.add(detailedAddress);
  if (ward.isNotEmpty) parts.add(ward);
  if (district.isNotEmpty) parts.add(district);
  if (province.isNotEmpty) parts.add(province);
  return parts.join(', ');
}
