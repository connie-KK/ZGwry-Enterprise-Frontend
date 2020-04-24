import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
  base: `${process.env.BASE_URL}/viewPages`,
  routes: [{
      path: '/homePage/:id',
      name: 'homePage',
      component: () => import('@/views/viewPages/homePage/index.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/viewPages/home/index.vue')
    },
    {
      path: '/entlist/:id',
      name: 'entlist',
      component: () => import('@/views/viewPages/list/index.vue')
    },
    // {
    //   path: '/homePage',
    //   name: 'homePage',
    //   component: () => import('@/views/viewPages/homePage/index.vue')
    // },
    {
      path: '/emissions',
      name: 'emissions',
      component: () => import('@/views/viewPages/emissions/index.vue')
    },
    {
      path: '/emissionsDetail/:id',
      name: 'emissionsDetail',
      component: () => import('@/views/viewPages/emissions/detail.vue')
    },
    {
      path: '/pollutionDetail/:id',
      name: 'pollutionDetail',
      component: () => import('@/views/viewPages/pollution/detail.vue')
    },
    {
      path: '/emissionsMap/:id',
      name: 'emissionsMap',
      component: () => import('@/views/viewPages/emissions/map.vue')
    },
    {
      path: '/pollution',
      name: 'pollution',
      component: () => import('@/views/viewPages/pollution/index.vue')
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('@/views/viewPages/detail.vue')
    },
    {
      path: '/example',
      name: 'example',
      component: () => import('@/views/viewPages/example/index.vue')
    },
    {
      path: '/business',
      name: 'business',
      component: () => import('@/views/viewPages/business/index.vue')
    },
    {
      path: '/license',
      name: 'license',
      component: () => import('@/views/viewPages/license/index.vue')
    },
    {
      path: '/envParams',
      name: 'envParams',
      component: () => import('@/views/viewPages/envParams/index.vue')
    },
    {
      path: '/taskList/:id',
      name: 'taskList',
      component: () => import('@/views/viewPages/wghTask/taskList.vue')
    },
    {
      path: '/putTask/:id',
      name: 'putTask',
      component: () => import('@/views/viewPages/wghTask/putTask.vue')
    },
    {
      path: '/taskModelList',
      name: 'taskModelList',
      component: () => import('@/views/viewPages/wghTask/taskModelList.vue')
    },
    {
      path: '/taskLinkEntList',
      name: 'taskLinkEntList',
      component: () => import('@/views/viewPages/wghTask/taskLinkEntList.vue')
    },
    {
      path: '/taskAssign',
      name: 'taskAssign',
      component: () => import('@/views/viewPages/wghTask/taskAssign.vue')
    },
    {
      path: '/taskLinkEventList',
      name: 'taskLinkEventList',
      component: () => import('@/views/viewPages/wghTask/taskLinkEventList.vue')
    },
    {
      path: '/taskResult/:id',
      name: 'taskResult',
      component: () => import('@/views/viewPages/wghTask/taskResult.vue')
    },
    {
      path: '/taskAssess/:id',
      name: 'taskAssess',
      component: () => import('@/views/viewPages/wghTask/taskAssess.vue')
    },
    {
      path: '/taskAssessC/:id',
      name: 'taskAssessC',
      component: () => import('@/views/viewPages/wghTask/taskAssessC.vue')
    },
    {
      path: '/taskTransfer',
      name: 'taskTransfer',
      component: () => import('@/views/viewPages/wghTask/taskTransfer.vue')
    },
    {
      path: '/noticeList',
      name: 'noticeList',
      component: () => import('@/views/viewPages/wghTask/noticeList.vue')
    },
    {
      path: '/taskMoreAssign',
      name: 'taskMoreAssign',
      component: () => import('@/views/viewPages/wghTask/taskMoreAssign.vue')
    },
    {
      path: '/taskAssignRecord',
      name: 'taskAssignRecord',
      component: () => import('@/views/viewPages/wghTask/taskAssignRecord.vue')
    },
    {
      path: '/taskModelDetail/:id',
      name: 'taskModelDetail',
      component: () => import('@/views/viewPages/wghTask/taskModelDetail.vue')
    },
    {
      path: '/mapPosition',
      name: 'mapPosition',
      component: () => import('@/views/viewPages/wghTask/mapPosition.vue')
    },
    {
      path: '/eventList/:id',
      name: 'eventList',
      component: () => import('@/views/viewPages/wghEvent/eventList.vue')
    },
    {
      path: '/eventContent/:id',
      name: 'eventContent',
      component: () => import('@/views/viewPages/wghEvent/eventContent.vue')
    },
    {
      path: '/eventDetail/:id',
      name: 'eventDetail',
      component: () => import('@/views/viewPages/wghEvent/eventDetail.vue')
    },
    {
      path: '/eventDetailLevel1/:id',
      name: 'eventDetailLevel1',
      component: () => import('@/views/viewPages/wghEvent/eventDetailLevel1.vue')
    },
    {
      path: '/eventMap/:id',
      name: 'eventMap',
      component: () => import('@/views/viewPages/wghEvent/eventMap.vue')
    },
    {
      path: '/enterpriseList',
      name: 'enterpriseList',
      component: () => import('@/views/viewPages/wghEvent/enterpriseList.vue')
    },
    {
      path: '/documents',
      name: 'documents',
      component: () => import('@/views/viewPages/documents/index.vue')
    },
    // {
    //   path: '*',
    //   redirect: '/home'
    // }
  ]
})