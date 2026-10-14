<script setup lang="ts">
  const newUsername = ref<string>()

  const oldPassword = ref<string>()
  const newPassword = ref<string>()

  const deleteUsername = ref<string>()
  const deleteConfirmation = ref<string>()

  const { user } = useUser()
  const { logout } = useAuth()
  const modalUsernameRef = ref<InstanceType<typeof AppDialog> | null>(null);
  const modalPasswordRef = ref<InstanceType<typeof AppDialog> | null>(null);
  const modalDeleteRef = ref<InstanceType<typeof AppDialog> | null>(null);

  const modalUsernameFn = () => modalUsernameRef.value?.open();
  const modalPasswordFn = () => modalPasswordRef.value?.open();
  const modalDeleteFn = () => modalDeleteRef.value?.open();

  const changeNewUsername = async () => {
    const res = await $fetch('/api/users/me/username', {
      method: 'PATCH',
      body: { username: newUsername.value }
    })
  }

  const changeNewPassword = async () => {
    const res = await $fetch('/api/users/me/password', {
      method: 'PATCH',
      body: {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
      }
    })
  }

  const deleteAccount = async () => {
    await $fetch('/api/users/me', {
      method: 'DELETE',
      body: {
        username: deleteUsername.value,
        confirmation: deleteConfirmation.value,
      },
    });

    await navigateTo('/login');
  };
</script>

<template>
  <div class="column">
    <div class="space-between">
      <h3>Change username</h3>
      <AppInput
        v-model="newUsername"
        @keyup.enter="changeNewUsername"
        :placeholder="user?.username"
      />
    </div>
    <div class="space-between">
      <h3>Password and authentication</h3>
      <AppButton
        @click="modalPasswordFn"
        class="button--default"
      >
        Change password
      </AppButton>
    </div>
    <div class="danger--container">
      <div class="space-between">
        <div>
          <h4 class="red">Log out</h4>
          <span>You can come back later.</span>
        </div>
        <AppButton
          @click="logout"
          class="button--warning"
        >
          Log out
        </AppButton>
      </div>
      <div class="space-between">
        <div>
          <h4 class="red">Delete account</h4>
          <span>Once you delete your account, there is no going back. Please be certain.</span>
        </div>
        <AppButton
          @click="modalDeleteFn"
          class="button--warning"
        >
          Delete Account
        </AppButton>
      </div>
    </div>
  </div>

  <AppDialog ref="modalPasswordRef" class="modal">
    <div>
      <label for="oldPswd">
        <b>Old passord:</b>
      </label>
      <AppInput v-model="oldPassword" id="oldPswd" />
      <label for="newPswd">
        <b>New passord:</b>
      </label>
      <AppInput id="newPswd" />
      <label for="confirmNewPswd">
        <b>Confirm new passord:</b>
      </label>
      <AppInput v-model="newPassword" id="confirmNewPswd" />
    </div>
    <AppButton @click="changeNewPassword" class="button--default">Update password</AppButton>
  </AppDialog>

  <AppDialog ref="modalUsernameRef" class="modal">
    <h4>Really change your username?</h4>
    <AppButton class="button--warning">I understand, let's change my username</AppButton>
  </AppDialog>

  <AppDialog ref="modalDeleteRef" class="modal">
    <h4>Are you sure you want to do this?</h4>
    <p>We will immediately delete all of your spins history.</p>

    <div>
      <label for="delete"><b>Your username:</b></label>
      <AppInput v-model="deleteUsername" id="delete" />
    </div>
    <div>
      <label for="delete"><b>To verify,</b> <i>delete my account</i> <b>type exactly as it appears:</b></label>
      <AppInput v-model="deleteConfirmation" id="delete" />
    </div>
    <AppButton @click="deleteAccount" class="button--warning">Delete my account</AppButton>
  </AppDialog>

</template>

<style scoped>
.red {
  color: red;
}
.button--warning {
  color: red;
  &:hover {
    background-color: red;
    color: white;
  };
}
.danger-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.danger--container {
  padding: 12px;
  border: 1px solid red;
  border-radius: 6px;
}
.space-between {
  margin: 8px 0;
}
.modal {
  background-color: white;
}
label {
  display: block;
}
</style>
