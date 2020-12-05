import React from 'react';
import PropTypes from 'prop-types';
import connect from '@vkontakte/vkui-connect';
import Icon24Gift from '@vkontakte/icons/dist/24/gift';
import Icon28Settings from '@vkontakte/icons/dist/28/settings';
import Icon16Fire from "@vkontakte/icons/dist/16/fire";
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon24Coins from '@vkontakte/icons/dist/24/coins';
import Icon24MoneyTransfer from '@vkontakte/icons/dist/24/money_transfer';
import Icon24Market from '@vkontakte/icons/dist/24/market';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon28Send from '@vkontakte/icons/dist/28/send';
import Icon24Bug from '@vkontakte/icons/dist/24/bug';
import Icon24Settings from '@vkontakte/icons/dist/24/settings';
import Icon28Favorite from '@vkontakte/icons/dist/28/favorite';
import Icon24SkipNext from '@vkontakte/icons/dist/24/skip_next';
import Icon12Fire from '@vkontakte/icons/dist/12/fire';
import Icon28GiftOutline from '@vkontakte/icons/dist/28/gift_outline';
import Icon24Send from '@vkontakte/icons/dist/24/send';
import Icon24Game from '@vkontakte/icons/dist/24/game';
import Icon28User from '@vkontakte/icons/dist/28/user';
import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import Icon24Home from '@vkontakte/icons/dist/24/home';
import Icon24Services from '@vkontakte/icons/dist/24/services';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/settings';
import { Panel, Button, Group, Gallery, Div, Avatar, Separator, PanelHeader, Footer, Search, CardGrid, Card, List, Cell, Header, Tooltip, FormStatus, FixedLayout, Epic, Tabbar, TabbarItem } from '@vkontakte/vkui';
import './assets/css/bootstrap.css';
import './assets/css/style.css';
import '@vkontakte/vkui/dist/vkui.css';

const Home = props => (
	<Panel id={props.id} separator={false}>
	<div class='inn'>
<br /> 
                               <Div className='balance'>
                            <p>СЧЕТ</p>
                            <h1>
                               {parseFloat(props.balance).toFixed(5)} PC
                            </h1>
                            <p>
                             {parseFloat(props.mine).toFixed(5)} PC/сек
                            </p>
                            <p>
                             {parseFloat(props.clicksec).toFixed(5)} PC/клик
                            </p>
                        </Div>
               <div className='MenuButtons'>
		<div className='MenuButtons__button'>
			<div className='MenuButtons__icon'>
				<Icon24Favorite fill='#000' onClick={props.go} data-to="top" />

			</div>
			
		</div>
		<div className='MenuButtons__button'>
			<div className='MenuButtons__icon'>
				<Icon24MoneyTransfer fill='#000' onClick={props.modal} data-to="transfer" />
			</div>
			
		</div>
		<div className='MenuButtons__button'>
			<div className='MenuButtons__icon'>
				<Icon24MoreHorizontal fill='#000' onClick={props.go} data-to="shop" />
			</div>
			
		</div>
	</div>
	</div>
            	<Div align="center" style={{ height: "315px"}}>
       	<img onClick={props.click} src={require('../img/click.png')} onClick={props.click} width={300} height={300} />
    </Div>
	</Panel>

);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
