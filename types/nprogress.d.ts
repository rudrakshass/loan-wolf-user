declare module "nprogress" {
  interface NProgress {
    start: () => void;
    done: () => void;
  }
  const nprogress: NProgress;
  export default nprogress;
}
