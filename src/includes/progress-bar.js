import NProgress from 'nprogress'

export default (router) => {
  router.beforeEach(() => {
    NProgress.start()
  })

  router.afterEach(NProgress.done)
}
