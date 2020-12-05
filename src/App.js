import React from 'react';
import connect from '@vkontakte/vk-bridge';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import { View, Alert, Snackbar, Avatar, Group, List, Cell, ScreenSpinner, ModalPageHeader, ActionSheet, ActionSheetItem, ModalRoot, ModalPage, FormLayoutGroup, FormLayout, Input, Div, Button } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';

import Top from './panels/Top';

import Transfer from './panels/Transfer';

import Shop from './panels/Shop';

import Ban from './panels/Ban';

import ServerOff from './panels/ServerOff';

import History from './panels/History';

const queryString = require('query-string');
const crypto = require('crypto');
const parsedHash = queryString.parse(window.location.hash);

const orangeBackground = {
  backgroundImage: 'linear-gradient(135deg, #ffb73d, #ffa000)'
};

const blueBackground = {
  backgroundColor: 'var(--accent)'
};

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'home',
            toid: null,
            insec: 0, 
            promo: null,
            activeModal: null,
            messages: [],
            ban: false,
            reason: '',
            sum: null,
            topme: null,
            gold: 0, 
            history: [],
            top: [],
            activeTopTab: 'balance',
            ban: false,
            balance: 0,
            mine: 0, 
            click: 0, 
            text: '',
            snackbar: <Snackbar
        layout="vertical"
        onClose={() => this.setState({ snackbar: null })}
        before={<Avatar size={24} style={blueBackground}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
      >
        Test
      </Snackbar>,
            popout: <ScreenSpinner />
		};
		this.openDefault = this.openDefault.bind(this);
        this.closePopout = this.closePopout.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.idChange = this.idChange.bind(this);
        this.promoChange = this.promoChange.bind(this);
        this.sumChange = this.sumChange.bind(this);
        this.serverOn = this.serverOn.bind(this);
	}

	componentDidMount() {
        connect.send("VKWebAppShowNativeAds", {ad_format:"preloader"})  
		connect.subscribe((e) => {
			switch (e.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					this.setState({ fetchedUser: e.detail.data });
					this.createUser();
                    setTimeout(() => {
                    	this.closePopout()
                    }, 3000)
                    
					break;
                case 'VKWebAppOpenCodeReaderResult':
                    this.setState({ toid: e.detail.data.code_data, activePanel: 'transfer' });
                    console.log(e.detail.data)
                    
                    break;

				default:
					console.log(e.detail.type);
			}
		});

       
		connect.send('VKWebAppGetUserInfo', {});
		 
		setInterval(() => {
            this.createUser()
           
            if (!this.state.ban) {
            this.mine()
        } 
            if (this.state.ban) {
                this.setState({ activePanel: 'ban' })
            }
        }, 1000)
        setTimeout(() => {
                        this.closePopout()
                    }, 1000)
	}

	go = (e) => {
		this.setState({ activePanel: e.currentTarget.dataset.to })
        if (e.currentTarget.dataset.to === 'top') {
            this.getTop()
             this.getSpeedTop()
            this.getGroupTop()
        }
        if (e.currentTarget.dataset.to === 'history') {
            this.getHistory()
        }
	};

    openDefault(title, msg, actions) {
        this.setState({
            popout:
                <Alert
                    actions={[actions]}
                    onClose={this.closePopout}
                >   
                    <h2>{title}</h2>
                    <p>{msg}</p>
                </Alert>
        });
    }

    closePopout() {
        this.setState({ popout: null });
    }

    closeModal() {
        this.setState({ activeModal: null });
    }

    modal = (e) => {
        this.setState({ activeModal: e.currentTarget.dataset.to })
    };
 tab = (e) => {
        this.setState({ activeTopTab: e.currentTarget.dataset.to })
    };
  createUser = () => {   
        fetch(`https://pepecoin.tk:9090/app/createUser/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               
                this.setState({ gold: response.response[0].gold, mine: response.response[0].mine, click: response.response[0].click, mine10: response.response[0].mine10, mine9: response.response[0].mine9, mine8: response.response[0].mine8, mine7: response.response[0].mine7, mine6: response.response[0].mine6, mine5: response.response[0].mine5, mine4: response.response[0].mine4, mine3: response.response[0].mine3, mine2: response.response[0].mine2, mine1: response.response[0].mine1, balance: response.response[0].balance, click1: response.response[0].click1, click2: response.response[0].click2, click3: response.response[0].click3, click4: response.response[0].click4, click5: response.response[0].click5, balance: response.response[0].balance, reason: response.response[0].reason, ban: response.response[0].ban, insec: response.response[0].second })
                if (response.response[0].reg === 1) {
                    this.setState({ activePanel: 'welcome' })
                }
               
            })
            .catch((error) => {
                
                //this.setState({ activePanel: 'serveroff' })
            })
    }

    getHistory = () => {
        fetch(`https://pepecoin.tk:9090/app/getHistory/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               
                this.setState({ history: response.response[0].history })
               
            })
            .catch((error) => {
                
                //this.setState({ activePanel: 'serveroff' })
            })
    }

    mine = () => {
        fetch(`https://pepecoin.tk:9090/app/mine/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               
                this.setState({ balance: response.response[0].balance })
                
            })
            .catch((error) => {
               //this.setState({ activePanel: 'serveroff' })
            })
    }

    click = () => {
        fetch(`https://pepecoin.tk:9090/app/click/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               
                this.setState({ mine10: response.response[0].mine10, mine9: response.response[0].mine9, mine8: response.response[0].mine8, mine7: response.response[0].mine7, mine6: response.response[0].mine6, mine5: response.response[0].mine5, mine4: response.response[0].mine4, mine3: response.response[0].mine3, mine2: response.response[0].mine2, mine1: response.response[0].mine1, balance: response.response[0].balance, click1: response.response[0].click1, click2: response.response[0].click2, click3: response.response[0].click3, click4: response.response[0].click4, click5: response.response[0].click5,  balance: response.response[0].balance })
                
            })
            .catch((error) => {
               //this.setState({ activePanel: 'serveroff' })
            })
    }

    getTop = () => {
        fetch(`https://pepecoin.tk:9090/app/getTop/?uid=${this.state.fetchedUser.id}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({ top: response.users, topme: response.me })
               
            })
            .catch((error) => {
               //this.setState({ activePanel: 'serveroff' })
            })
    }

    transfer = () => {
        fetch(`https://pepecoin.tk:9090/app/userTranfer/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               
               switch (response.response[0].status) {
                    case 'ok':
                        this.openDefault("Успешно!", "Перевод отправлен.", {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
               //this.setState({ activePanel: 'serveroff' })
            })
    }

buyClick1 = () => {      
        fetch(`https://pepecoin.tk:9090/app/click1/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,  click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer() 
                 // //this.setState({ activePanel: 'serveroff' })
            })
    }

    buyClick2 = () => {    
        fetch(`https://pepecoin.tk:9090/app/click2/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
               //  //this.setState({ activePanel: 'serveroff' })
            })
    }

    buyClick3 = () => {  
        fetch(`https://pepecoin.tk:9090/app/click3/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
               ////this.setState({ activePanel: 'serveroff' })
            })
    }
 buyClick4 = () => {  
        fetch(`https://pepecoin.tk:9090/app/click4/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                this.offServer()
                ////this.setState({ activePanel: 'serveroff' })
            })
    }
     buyClick5 = () => {  
        fetch(`https://pepecoin.tk:9090/app/click5/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
               ////this.setState({ activePanel: 'serveroff' })
            })
    }
 buyAuto1 = () => { 
        fetch(`https://pepecoin.tk:9090/app/mine1/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
      this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
               ////this.setState({ activePanel: 'serveroff' })
            })
    }

    buyAuto2 = () => {
        fetch(`https://pepecoin.tk:9090/app/mine2/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
               ////this.setState({ activePanel: 'serveroff' })
            })
    }
buyAuto3 = () => {  
        fetch(`https://pepecoin.tk:9090/app/mine3/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
               ////this.setState({ activePanel: 'serveroff' })
            })
    }
buyAuto4 = () => { 
        fetch(`https://pepecoin.tk:9090/app/mine4/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
               ////this.setState({ activePanel: 'serveroff' })
            })
    }
buyAuto5 = () => {
        fetch(`https://pepecoin.tk:9090/app/mine5/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
               ////this.setState({ activePanel: 'serveroff' })
            })
    }
buyAuto6 = () => {
        fetch(`https://pepecoin.tk:9090/app/mine6/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
              // //this.setState({ activePanel: 'serveroff' })
            })
    }
buyAuto7 = () => {
        fetch(`https://pepecoin.tk:9090/app/mine7/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
              // //this.setState({ activePanel: 'serveroff' })
            })
    }
buyAuto8 = () => {
        fetch(`https://pepecoin.tk:9090/app/mine8/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
              // //this.setState({ activePanel: 'serveroff' })
            })
    }
buyAuto9 = () => {
        fetch(`https://pepecoin.tk:9090/app/mine9/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
               ////this.setState({ activePanel: 'serveroff' })
            })
    }
     promo = () => {
        fetch(`https://pepecoin.tk:9090/app/promo/?uid=${this.state.fetchedUser.id}&promo=${this.state.promo}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               
               switch (response.response[0].status) {
                    case 'ok':
                        this.openDefault("Успешно!", response.response[0].description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
                connect.send("VKWebAppShowNativeAds", {ad_format:"preloader"})
            })
            .catch((error) => {
                 //this.offServer()
               this.setState({ activePanel: 'serveroff' })
            })
    }
buyAuto10 = () => {
        fetch(`https://pepecoin.tk:9090/app/mine10/?uid=${this.state.fetchedUser.id}&photo=${this.state.fetchedUser.photo_100}&name=${this.state.fetchedUser.first_name}&from=${this.state.fetchedUser.id}&to=${this.state.toid}&sum=${this.state.sum}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
               this.setState({click: response.response[0].click,   click: response.response[0].click, mine: response.response[0].mine})

               switch (response.response[0].status) {
                    case 'error': 
                        this.openDefault("Произошла ошибка.", response.response[0].error_description, {
                            title: 'ОК',
                            autoclose: true,
                        })
                        break;

                    default: break;
                }
            })
            .catch((error) => {
                 this.offServer()
              // //this.setState({ activePanel: 'serveroff' })
            })
    }
getGroupTop = () => {
        fetch(`https://pepecoin.tk:9090/app/getGroupsTop/?uid=${this.state.fetchedUser.id}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({ groups: response.groups })
               
            })
            .catch((error) => {
                 this.offServer()
               ////this.setState({ activePanel: 'serveroff' })
            })
    }
        getSpeedTop = () => {
        fetch(`https://pepecoin.tk:9090/app/getSpeedTop/?uid=${this.state.fetchedUser.id}`, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({ speedtop: response.users, topme: response.me })
               
            })
            .catch((error) => {
                 this.offServer()
               ////this.setState({ activePanel: 'serveroff' })
            })
    }
    serverOn() {
         this.setState({ activePanel: 'home', popout: <ScreenSpinner /> })
         setTimeout(() => {
                        this.closePopout()
                    }, 1000)
    }

    sumChange(event) {
       
        this.setState({ sum: event.target.value})
    }

    idChange(event) {
       
        this.setState({ toid: event.target.value})
    }

    promoChange(event) {
       
        this.setState({ promo: event.target.value})
    }

	render() {
        const modal = (
      <ModalRoot
        activeModal={this.state.activeModal}
        onClose={this.closeModal}
      >
      <ModalPage
          id='promo'
          header={
            <ModalPageHeader
              
            >
             Активация промокода
            </ModalPageHeader>
          }
          settlingHeight={80}
        >
        <FormLayout>
      <FormLayoutGroup top="Промокод">
        <Input type="text" defaultValue="" onChange={this.promoChange} />
         </FormLayoutGroup>
    </FormLayout>
    <Div>
       <Button size="xl" onClick={this.promo}>Активировать</Button>
     </Div>
        </ModalPage>
        <ModalPage
          id='gold'
          header={
            <ModalPageHeader
              
            >
             Золото
            </ModalPageHeader>
          }
          settlingHeight={80}
        >
 <Group>
              <List>
                <Cell indicator={this.state.gold}>Баланс</Cell>
              </List>
            </Group>
    <Div>
       <Button size="xl" href="https://vk.com/pepe_coin" target="_blank" >Купить</Button>
     </Div>
     <br /> 
        </ModalPage>
 <ModalPage
          id='transfer'
          header={
            <ModalPageHeader
              
            >
Перевод
            </ModalPageHeader>
          }
          settlingHeight={80}
        >
         <FormLayout>
      <FormLayoutGroup top="ID">
        <Input type="number" defaultValue={this.toid} onChange={this.idChange} />
        </FormLayoutGroup>
    </FormLayout>
     <FormLayout>
      <FormLayoutGroup top="Сумма">
        <Input type="number" onChange={this.sumChange} />
        </FormLayoutGroup>
    </FormLayout>
     <Div>
       <Button size="xl" onClick={this.transfer}>Перевести</Button>
     </Div>
        </ModalPage>
      </ModalRoot> 
      );
		return (
			<View popout={this.state.popout} modal={modal} activePanel={this.state.activePanel}>
				<Home id="home"  modal={this.modal} mine={this.state.mine} clicksec={this.state.click} snackbar={this.state.snackbar} sec={this.state.insec} click={this.click} balance={this.state.balance} openBase={this.openBase} fetchedUser={this.state.fetchedUser} go={this.go} />
                <Ban id="ban" fetchedUser={this.state.fetchedUser} reason={this.state.reason} modal={this.modal} go={this.go} />
                <ServerOff id="serveroff" on={this.serverOn} fetchedUser={this.state.fetchedUser} go={this.go} />
                <History id="history" history={this.state.history} on={this.serverOn} fetchedUser={this.state.fetchedUser} go={this.go} />
                <Top id="top" groups={this.state.groups} speedtop={this.state.speedtop} set={this.tab} tab={this.state.activeTopTab} top={this.state.top} fetchedUser={this.state.fetchedUser} go={this.go} />
                <Shop id="shop" modal={this.modal} mine1={this.state.mine1} mine2={this.state.mine2} mine3={this.state.mine3} mine4={this.state.mine4} mine5={this.state.mine5} mine6={this.state.mine6} mine7={this.state.mine7} mine8={this.state.mine8} mine9={this.state.mine9} mine10={this.state.mine10} click1={this.state.click1} click2={this.state.click2} click3={this.state.click3} click4={this.state.click4} click5={this.state.click5}  mine={this.state.mine} click={this.state.click} buyClick1={this.buyClick1} buyClick2={this.buyClick2} buyClick3={this.buyClick3} buyClick4={this.buyClick4} buyClick5={this.buyClick5} buyAuto1={this.buyAuto1}  buyAuto2={this.buyAuto2}  buyAuto3={this.buyAuto3}  buyAuto4={this.buyAuto4}  buyAuto5={this.buyAuto5} buyAuto6={this.buyAuto6}  buyAuto7={this.buyAuto7}  buyAuto8={this.buyAuto8}  buyAuto9={this.buyAuto9} buyAuto10={this.buyAuto10} top={this.state.top} fetchedUser={this.state.fetchedUser} go={this.go} />
                <Transfer id="transfer" fetchedUser={this.state.fetchedUser} transfer={this.transfer} sumChange={this.sumChange} idChange={this.idChange} toid={this.state.toid} go={this.go} balance={this.state.balance} online={this.state.online} click={this.click} />
            </View>
		);
	}
}

export default App;