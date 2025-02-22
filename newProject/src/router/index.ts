import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProjectView from '../views/ProjectView.vue';
import ProjectEdit from '../views/Edits/ProjectsEdit.vue';
import TopicsView from '../views/TopicsView.vue';
import CompaniesView from '../views/CompaniesView.vue';
import UsersView from '../views/UsersView.vue';
import ReviewsView from '../views/ReviewsView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProjectDetails from '../views/ProjectDetails.vue';
import UpdateDetail from '../views/UpdateDetail.vue';
import NewsDetailsVue from '../views/NewsDetails.vue';
import CountriesVue from '../views/Edits/CountriesEdit.vue';
import ProjectsEditVue from '../views/Edits/ProjectsEdit.vue';
import StatusesVue from '../views/Edits/Statuses.vue';
import UserManagementVue from '../views/Edits/UserManagement.vue';
// import RegionsVue from '../views/Regions.vue';
import NewsEditVue from '../views/Edits/NewsEdit.vue';
import ScientificReviewsEditVue from '../views/ScientificReviewsEdit.vue';
import ProjectCommentsVue from '../views/ProjectComments.vue';
import CharactersVue from '../views/Edits/Characters.vue';
import CompaniesEditVue from '../views/Edits/CompaniesEdit.vue';
const routes: Array<RouteRecordRaw> = [
  { path: '/', 
    name: 'home', 
    component: HomeView 
  },
  { path: '/ProductUpdateEdit', 
    name: 'ProductUpdateEdit', 
    component: ProjectEdit 
  },
  { path: '/projects', name: 'projects', component: ProjectView },
  { path: '/topics', name: 'topics', component: TopicsView },
  { path: '/companies', name: 'companies', component: CompaniesView },
  { path: '/users', name: 'users', component: UsersView },
  { path: '/reviews/:id', name: 'reviews', component: ReviewsView },
  { path: '/news/:id', name: 'news', component: NewsDetailsVue },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/projects1/:id', name: 'projectDetails1', component: ProjectDetails },
  { path: '/updates/:id', name: 'UpdateDetail', component: UpdateDetail },
  { path: '/projects/:id', name: 'ProjectDetails', component: ProjectDetails },
  { path: '/projects_edit', name: 'ProjectsEdit', component: ProjectsEditVue },
  { path: '/countries', name: 'Countries', component: CountriesVue },
  { path: '/statuses', name: 'Statuses', component: StatusesVue },
  { path: '/user_management', name: 'UserManagement', component: UserManagementVue },
  // { path: '/regions', name: 'Regions', component: RegionsVue },
  { path: '/news_edit', name: 'NewsEdit', component: NewsEditVue },
  { path: '/scientific_reviews_edit', name: 'ScientificReviewsEdit', component: ScientificReviewsEditVue },
  { path: '/project_comments', name: 'ProjectComments', component: ProjectCommentsVue },
  { path: '/characters', name: 'Characters', component: CharactersVue },
  { path: '/companiesEdit', name: 'CompEdit', component: CompaniesEditVue }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const userType = localStorage.getItem('userType');
  if ((to.name === 'users' || to.name === 'UsersView') && userType !== 'admin') {
    next('/');
  } else {
    next();
  }
});

export default router;
