import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ProjectView from '../views/ProjectView.vue';
import ProjectEdit from '../views/Edits/ProjectsEdit.vue';
import NewsView from '../views/NewsView.vue';
import ScientificReviewVue from '../views/ScientificReview.vue';
import UsersView from '../views/UsersView.vue';
import ReviewsView from '../views/ReviewsView.vue';
import LoginView from '../views/LoginView.vue';
import ProjectDetails from '../views/ProjectDetails.vue';
import NewsDetailsVue from '../views/NewsDetails.vue';
import CountriesVue from '../views/Edits/CountriesEdit.vue';
import ProjectsEditVue from '../views/Edits/ProjectsEdit.vue';
import StatusesVue from '../views/Edits/Statuses.vue';
import UserManagementVue from '../views/Edits/UserManagement.vue';
import ProjectUpdatesVue from '../views/Edits/ProjectUpdates.vue';
import NewsEditVue from '../views/Edits/NewsEdit.vue';
import ScientificReviewsEditVue from '../views/ScientificReviewsEdit.vue';
import ProjectCommentsVue from '../views/ProjectComments.vue';
import CharactersVue from '../views/Edits/Characters.vue';
import CompaniesEditVue from '../views/Edits/CompaniesEdit.vue';
import TopicsEditVue from '../views/Edits/TopicsEdit.vue';
import Document_EditVue from '../views/Edits/Document_Edit.vue';
import UserTypesEditVue from '../views/Edits/UserTypesEdit.vue';
import activationView from '../views/activationView.vue';
import resetPasswordVue from '../views/resetPassword.vue';


const routes: Array<RouteRecordRaw> = [
  { 
    path: '/', 
    name: 'home', 
    component: ProjectView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/ProductUpdateEdit', 
    name: 'ProductUpdateEdit', 
    component: ProjectEdit,
    meta: { requiresAuth: true }
  },
  { 
    path: '/projects', 
    name: 'projects', 
    component: ProjectView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/topic_edit', 
    name: 'TopicEdit', 
    component: TopicsEditVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/news', 
    name: 'news', 
    component: NewsView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/scientific_review', 
    name: 'scientific_review', 
    component: ScientificReviewVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/users', 
    name: 'users', 
    component: UsersView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/reviews/:id', 
    name: 'reviews', 
    component: ReviewsView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/news_details/:id', 
    name: 'news_details', 
    component: NewsDetailsVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView,
    meta: { requiresAuth: false, hideLayout: true}
  },
  // { 
  //   path: '/projects1/:id', 
  //   name: 'projectDetails1', 
  //   component: ProjectDetails,
  //   meta: { requiresAuth: true }
  // },
  { 
    path: '/projects/:id', 
    name: 'ProjectDetails', 
    component: ProjectDetails,
    meta: { requiresAuth: true }
  },
  { 
    path: '/projects_edit', 
    name: 'ProjectsEdit', 
    component: ProjectsEditVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/countries', 
    name: 'Countries', 
    component: CountriesVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/statuses', 
    name: 'Statuses', 
    component: StatusesVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/user_management', 
    name: 'UserManagement', 
    component: UserManagementVue,
    meta: { requiresAuth: true }
  },
  {
    path: '/projectUpdates_edit',
    name: 'ProjectUpdates',
    component: ProjectUpdatesVue,
    props: route => ({ projectId: route.query.projectId }),
    meta: { requiresAuth: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: resetPasswordVue,
    props: (route) => ({ token: route.query.token }),
    meta: { requiresAuth: false, hideLayout: true }  // No authentication required
  },
  {
    path: '/activate-account',
    name: 'activateAccount',
    component: activationView,
    props: (route) => ({ token: route.query.token }),
    meta: { requiresAuth: false, hideLayout: true }  // No authentication required
  },
  { 
    path: '/news_edit', 
    name: 'NewsEdit', 
    component: NewsEditVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/scientific_reviews_edit', 
    name: 'ScientificReviewsEdit', 
    component: ScientificReviewsEditVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/project_comments', 
    name: 'ProjectComments', 
    component: ProjectCommentsVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/characters', 
    name: 'Characters', 
    component: CharactersVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/document_edit', 
    name: 'Document_Edit', 
    component: Document_EditVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/userTypes_edit', 
    name: 'UserTypesEditVue', 
    component: UserTypesEditVue,
    meta: { requiresAuth: true }
  },
  { 
    path: '/companiesEdit', 
    name: 'CompEdit', 
    component: CompaniesEditVue,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Add authentication guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth === false) {
    next();
    return;
  }
  
  const token = localStorage.getItem('token');
  if (!token) {
    next({ name: 'login' });
    return;
  }
  
  const role = localStorage.getItem('role');
  if (to.name === 'users' && role !== 'admin') {
    next('/');
    return;
  }
  
  next();
});

export default router;