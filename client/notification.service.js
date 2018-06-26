import swal from 'sweetalert2';

module.exports = {
  showToast(title, message, type) {
    swal({
      title: title,
      text: message,
      type: type,
      toast: true,
      position: 'top-right',
      timer: '3000',
      showConfirmButton: false
    });
  },

  showGenericError() {
    this.showToast(
      'Error!',
      'An error has occurred. Please try again',
      'error'
    );
  }
};
