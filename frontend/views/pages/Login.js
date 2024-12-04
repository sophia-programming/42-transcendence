const Login = {
  render: async () => {
    return `<main
                class="form-signin d-flex flex-column justify-content-center align-items-center"
                style="min-height: 80vh"
                >
                <form method="post" action="">
                    <div class="mb-3">
                    <label for="id_username" class="form-label"></label>
                    </div>
                    <div class="mb-3">
                    <label for="id_password" class="form-label"></label>
                    </div>
                    <input type="hidden" value="" />
                    <button type="submit" class="btn btn-primary mb-2 w-100">Login</button>
                </form>
                <a href="" class="btn btn-secondary w-100 mb-2" style="max-width: 282px"
                    >Sign Up</a
                >
                <a href="" class="btn btn-primary w-100" style="max-width: 282px"
                    >Login with 42</a
                >
                </main>`;
  },

  after_render: async () => {},
};

export default Login;
