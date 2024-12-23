const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

// Lấy thông tin User-Agent từ request headers
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
// Phân tích dữ liệu phản hồi JSON
var obj = JSON.parse($response.body);

// Thêm thông báo cá nhân hóa
obj.Attention = "Chúc mừng bạn! Vui lòng không bán hoặc chia sẻ cho người khác!";

// Định nghĩa gói đăng ký mẫu (premium)
const premiumSubscription = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-31T23:59:59Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "2024-01-01T00:00:00Z",
  purchase_date: "2024-01-01T00:00:00Z",
  store: "app_store"
};

const premiumEntitlement = {
  grace_period_expires_date: null,
  purchase_date: "2024-01-01T00:00:00Z",
  product_identifier: "com.premium.yearly",
  expires_date: "2099-12-31T23:59:59Z"
};

// Tìm chuỗi phù hợp trong User-Agent
const match = Object.keys(mapping).find(key => ua.includes(key));
if (match) {
  const [entitlementKey, productIdentifier] = mapping[match];
  // Ánh xạ entitlement và subscription nếu có productIdentifier
  if (productIdentifier) {
    premiumEntitlement.product_identifier = productIdentifier;
    obj.subscriber.subscriptions[productIdentifier] = premiumSubscription;
  }
  obj.subscriber.entitlements[entitlementKey] = premiumEntitlement;
} else {
  // Nếu không khớp, thêm gói cao cấp mặc định
  obj.subscriber.subscriptions["com.premium.yearly"] = premiumSubscription;
  obj.subscriber.entitlements["pro"] = premiumEntitlement;
}

// Trả về phản hồi đã chỉnh sửa
$done({ body: JSON.stringify(obj) });
