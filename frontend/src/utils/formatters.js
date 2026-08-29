// Currency, Date and Status Formatters

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount).replace('₫', '₫');
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getOrderStatusInfo = (status) => {
  switch (status) {
    case 'Pending':
      return {
        label: 'Chờ xác nhận',
        color: 'bg-amber-400 text-black border-black',
        step: 1,
        desc: 'Đơn hàng đang chờ nhân viên kiểm tra'
      };
    case 'Confirmed':
      return {
        label: 'Đã xác nhận',
        color: 'bg-blue-400 text-black border-black',
        step: 2,
        desc: 'Đã xác nhận và đang đóng gói'
      };
    case 'Processing':
      return {
        label: 'Đang chuẩn bị',
        color: 'bg-indigo-400 text-white border-black',
        step: 3,
        desc: 'Đang xử lý tại kho'
      };
    case 'Shipping':
      return {
        label: 'Đang vận chuyển',
        color: 'bg-purple-400 text-black border-black',
        step: 4,
        desc: 'Shipper đang trên đường giao đến bạn'
      };
    case 'Delivered':
      return {
        label: 'Đã giao thành công',
        color: 'bg-[#00ff66] text-black border-black',
        step: 5,
        desc: 'Kiện hàng đã được giao thành công'
      };
    case 'Cancelled':
      return {
        label: 'Đã hủy',
        color: 'bg-red-500 text-white border-black',
        step: 0,
        desc: 'Đơn hàng đã được hủy'
      };
    default:
      return {
        label: status || 'Không rõ',
        color: 'bg-gray-300 text-black border-black',
        step: 0,
        desc: ''
      };
  }
};

export const getPaymentStatusInfo = (status) => {
  switch (status) {
    case 'Paid':
      return { label: 'Đã thanh toán', color: 'bg-[#00ff66] text-black' };
    case 'Pending':
      return { label: 'Chờ thanh toán', color: 'bg-amber-300 text-black' };
    case 'Failed':
      return { label: 'Thất bại', color: 'bg-red-400 text-white' };
    case 'Refunded':
      return { label: 'Đã hoàn tiền', color: 'bg-blue-400 text-black' };
    default:
      return { label: status, color: 'bg-gray-200 text-black' };
  }
};
