import {Module} from '../decorators';
import AppLoadingBar from './loading.config';
import uiBootstrap from 'angular-bootstrap';
import ngFileUpload from 'ng-file-upload';
import PlayerInlineModule from '../common/component/player-inline/player-inline';
import NavbarModule from '../common/component/navbar/navbar';
import AuthorizeNotificationModule from '../common/component/authorize-notification/authorize-notification';
import UpdatingModule from '../common/component/updating/updating';
import 'angular-touch';
import 'angular-animate';
import '../common/mixins.js';
import './bootstrap/bootstrap';
import './font-awesome/font-awesome';
import './ionicons/ionicons';
import './styles/styles';


@Module({
    name : 'ps.config',
    modules : [
        'ngTouch',
        'ngAnimate',
        uiBootstrap,
        ngFileUpload,
        NavbarModule,
        AuthorizeNotificationModule,
        AppLoadingBar.name,
        PlayerInlineModule,
        UpdatingModule
    ]
})
export default class Config{}