import Swal from 'sweetalert2'

export const confirmDelete = (name?: string) =>
  Swal.fire({
    title: 'ยืนยันการลบ?',
    text: name ? `ลบ "${name}" ออกจากระบบ` : 'การดำเนินการนี้ไม่สามารถย้อนกลับได้',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#FF3B30',
    cancelButtonColor: '#8E8E93',
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
    customClass: {
      popup: 'swal2-popup',
      title: 'swal2-title',
      htmlContainer: 'swal2-html-container',
    },
  })

export const confirmAction = (title: string, text: string) =>
  Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#007AFF',
    cancelButtonColor: '#8E8E93',
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true,
  })
