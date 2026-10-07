<script setup lang="ts">
  const { user } = useUser()
  const modalUsernameRef = ref<InstanceType<typeof AppDialog> | null>(null);
  const modalPasswordRef = ref<InstanceType<typeof AppDialog> | null>(null);
  const modalDeleteRef = ref<InstanceType<typeof AppDialog> | null>(null);

  const modalUsernameFn = () => modalUsernameRef.value?.open();
  const modalPasswordFn = () => modalPasswordRef.value?.open();
  const modalDeleteFn = () => modalDeleteRef.value?.open();
</script>

<template>
  <AppNav />
  <div>
    <h2>{{ user?.username }}</h2>
    <span>Your personal account</span>
  </div>

  <div class="column">
    <div>
      <h3>Change username</h3>
      <AppInput :placeholder="user?.username" />
    </div>
    <div>
      <h3>Password and authentication</h3>
      <AppButton @click="modalPasswordFn" class="button--default">Change password</AppButton>
    </div>
    <div>
      <h3 class="red">Delete account</h3>
      <p>Once you delete your account, there is no going back. Please be certain.</p>
      <AppButton @click="modalDeleteFn" class="button--warning">Delete Account</AppButton>
    </div>
  </div>

  <AppDialog ref="modalPasswordRef" class="modal">
    <div>
      <label for="oldPswd">
        <b>Old passord:</b>
      </label>
      <AppInput id="oldPswd" />
      <label for="newPswd">
        <b>New passord:</b>
      </label>
      <AppInput id="newPswd" />
      <label for="confirmNewPswd">
        <b>Confirm new passord:</b>
      </label>
      <AppInput id="confirmNewPswd" />
    </div>
    <AppButton class="button--default">Update password</AppButton>
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
      <AppInput id="delete" />
    </div>
    <div>
      <label for="delete"><b>To verify,</b> <i>delete my account</i> <b>type exactly as it appears:</b></label>
      <AppInput id="delete" />
    </div>
  </AppDialog>

</template>

<style scoped>
.red {
  color: red;
}
.button--default,
.button--warning {
  padding: 4px 12px;
  border: solid gray 1px;
  border-radius: 6px;
  background-color: #222;
  color: white;
  &:hover {
    background-color: #333;
  }
}
.button--warning {
  color: red;
  &:hover {
    background-color: red;
    color: white;
  };
}
.modal {
  background-color: white;
}
label {
  display: block;
}
</style>
