import swal from 'sweetalert2';
import notificationService from './notification.service';

module.exports = {
  async authenticate(password) {
    try {
      const response = await fetch(`/api/config/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
      });

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      notificationService.showGenericError();
    }
  },

  async getConfig(key) {
    try {
      const response = await fetch(`/api/config/${key}`);
      if (response.status != 200) {
        throw new Error();
      }
      const data = await response.json();
      return data;
    } catch (err) {
      notificationService.showGenericError();
    }
  },

  async getKeys() {
    const response = await fetch(`/api/config/keys`);
    if (response.status != 200) {
      throw new Error();
    }
    const data = await response.json();
    return data;
  },

  async createConfig(key, config) {
    try {
      const response = await fetch(`/api/config/${key}`, {
        method: 'POST',
        body: JSON.stringify(config),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status !== 200) {
        throw new Error();
      }
      notificationService.showToast('Success!', 'Config successfully created', 'success');
    } catch (err) {
      notificationService.showGenericError();
    }
  },

  async updateConfig(key, config) {
    try {
      const response = await fetch(`/api/config/${key}`, {
        method: 'PUT',
        body: JSON.stringify(config),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status !== 200) {
        throw new Error();
      }

      notificationService.showToast('Success!', 'Config successfully updated', 'success');
    } catch (err) {
      notificationService.showGenericError();
    }
  },

  async deleteConfig(key) {
    try {
      const confirmIntent = await swal({
        title: 'Are you sure?',
        text: `Are you sure you want to delete the '${key}' config? This action is irreversible!`,
        type: 'warning',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: 'Yep, delete it!',
        confirmButtonClass: 'button is-primary',
        cancelButtonClass: 'button is-danger'
      });

      if (confirmIntent.value) {
        const response = await fetch(`/api/config/${key}`, {
          method: 'DELETE'
        });
        if (response.status != 200) {
          throw new Error();
        }
        notificationService.showToast(
          'Success!',
          'Config successfully deleted',
          'success'
        );
      }
    } catch (err) {
      notificationService.showGenericError();
    }
  },

  getBlankConfig() {
    return {
      apiUrl: null,
      username: null,
      password: null,
      autoEnqueueTypes: null,
      usernameFieldSelector: null,
      passwordFieldSelector: null,
      submitInputSelector: null,
      loginUrl: null,
      siteUsername: null,
      sitePassword: null,
      useAuth: null
    };
  }
};
