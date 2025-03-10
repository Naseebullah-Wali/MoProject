import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// import HomeView from '../views/HomeView.vue';
import ProjectView from '../views/ProjectView.vue';
import ProjectEdit from '../views/Edits/ProjectsEdit.vue';
import NewsView from '../views/NewsView.vue';
import ScientificReviewVue from '../views/ScientificReview.vue';
import UsersView from '../views/UsersView.vue';
import ReviewsView from '../views/ReviewsView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProjectDetails from '../views/ProjectDetails.vue';
// import UpdateDetail from '../views/UpdateDetail.vue';
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

const routes: Array<RouteRecordRaw> = [
  { path: '/', 
    name: 'home', 
    component: ProjectView 
  },
  { path: '/ProductUpdateEdit', 
    name: 'ProductUpdateEdit', 
    component: ProjectEdit 
  },
  { path: '/projects', name: 'projects', component: ProjectView },
  { path: '/topic_edit', name: 'TopicEdit', component: TopicsEditVue },
  { path: '/news', name: 'news', component: NewsView },
  { path: '/scientific_review', name: 'scientific_review', component: ScientificReviewVue },
  { path: '/users', name: 'users', component: UsersView },
  { path: '/reviews/:id', name: 'reviews', component: ReviewsView },
  { path: '/news_details/:id', name: 'news_details', component: NewsDetailsVue },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/projects1/:id', name: 'projectDetails1', component: ProjectDetails },
  // { path: '/updates/:id', name: 'UpdateDetail', component: UpdateDetail },
  { path: '/projects/:id', name: 'ProjectDetails', component: ProjectDetails },
  { path: '/projects_edit', name: 'ProjectsEdit', component: ProjectsEditVue },
  { path: '/countries', name: 'Countries', component: CountriesVue },
  { path: '/statuses', name: 'Statuses', component: StatusesVue },
  { path: '/user_management', name: 'UserManagement', component: UserManagementVue },
  {
    path: '/projectUpdates_edit',
    name: 'ProjectUpdates',
    component: ProjectUpdatesVue,
    props: route => ({ projectId: route.query.projectId })
  },
  {
    path: '/activate-account',
    name: 'activateAccount',
    component: activationView,
    props: (route) => ({ token: route.query.token })
  },
  // { path: '/projectUpdates_edit/:projectId', name: 'ProjectUpdates', component: ProjectUpdatesVue },
  { path: '/news_edit', name: 'NewsEdit', component: NewsEditVue },
  { path: '/scientific_reviews_edit', name: 'ScientificReviewsEdit', component: ScientificReviewsEditVue },
  { path: '/project_comments', name: 'ProjectComments', component: ProjectCommentsVue },
  { path: '/characters', name: 'Characters', component: CharactersVue },
  { path: '/document_edit', name: 'Document_Edit', component: Document_EditVue },
  { path: '/userTypes_edit', name: 'UserTypesEditVue', component: UserTypesEditVue },
  { path: '/companiesEdit', name: 'CompEdit', component: CompaniesEditVue }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// router.beforeEach((to, from, next) => {
//   const userType = localStorage.getItem('userType');
//   if ((to.name === 'usersi' || to.name === 'UsersView') && userType !== 'admin') {
//     next('/');
//   } else {
//     next();
//   }
// });

export default router;
