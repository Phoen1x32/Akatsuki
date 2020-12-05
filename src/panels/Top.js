import React from 'react';
import PropTypes from 'prop-types';
import connect from '@vkontakte/vk-bridge';
import Icon24Gift from '@vkontakte/icons/dist/24/gift';
import Icon28Settings from '@vkontakte/icons/dist/28/settings';
import Icon16Fire from "@vkontakte/icons/dist/16/fire";
import Icon24Mention from '@vkontakte/icons/dist/24/mention';
import Icon28CubeBoxOutline from '@vkontakte/icons/dist/28/cube_box_outline';
import Icon24User from '@vkontakte/icons/dist/24/user';
import Icon24Coins from '@vkontakte/icons/dist/24/coins';
import Icon28UserAddOutline from '@vkontakte/icons/dist/28/user_add_outline';
import Icon24MoneyTransfer from '@vkontakte/icons/dist/24/money_transfer';
import Icon24Market from '@vkontakte/icons/dist/24/market';
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24Bug from '@vkontakte/icons/dist/24/bug';
import Icon24Settings from '@vkontakte/icons/dist/24/settings';
import Icon28GameOutline from '@vkontakte/icons/dist/28/game_outline';
import Icon24SkipNext from '@vkontakte/icons/dist/24/skip_next';
import Icon24Notification from '@vkontakte/icons/dist/24/notification';
import Icon28Game from '@vkontakte/icons/dist/28/game';
import Icon24Send from '@vkontakte/icons/dist/24/send';
import Icon12Fire from '@vkontakte/icons/dist/12/fire';
import Icon24Game from '@vkontakte/icons/dist/24/game';
import Icon12Verified from '@vkontakte/icons/dist/12/verified';
import Icon28WalletOutline from '@vkontakte/icons/dist/28/wallet_outline';
import Icon28User from '@vkontakte/icons/dist/28/user';
import Icon24Home from '@vkontakte/icons/dist/24/home';
import Icon24Services from '@vkontakte/icons/dist/24/services';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/settings';
import { Panel, Button, Tabs, TabsItem, FixedLayout, Group, Div, Input, Avatar, RichCell, PanelHeader, PanelHeaderBack, CardScroll, PanelHeaderButton, Gallery, Gradient, Banner, Search, InfoRow, Progress, List, Cell, Header, Tooltip, FormStatus, CardGrid, Card } from '@vkontakte/vkui';
const gradient = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
function Blog(props) {
 
  const content = Object.keys(props.posts).map((post) =>
    <div key={post.user_id}>
  
    {post < 100 ? <RichCell
before={<Avatar size={48} src={props.posts[post].photo} />}
caption={`Баланс: ${parseFloat(props.posts[post].balance).toFixed(5)} PC`}
after={Number(post) + 1}
onClick={() => window.location.href=`https://vk.com/id${props.posts[post].id}`}
><div style={{ display: 'flex' }}>
{props.posts[post].name}
</div>
</RichCell>
 :null}
    </div>
  );

  return (
    <div>
     
      {content}
    </div>
  );
}

function Blog1(props) {

    const content = Object.keys(props.posts).map((post) =>
    <div key={post.user_id}>

    {post < 100 ? <RichCell
    before={<Avatar size={48} src={props.posts[post].photo} />}
    caption={`Скорость: ${parseFloat(props.posts[post].balance).toFixed(5)} PC`}
    after={Number(post) + 1}
    onClick={() => window.location.href=`https://vk.com/id${props.posts[post].id}`}
    ><div style={{ display: 'flex' }}>
    {props.posts[post].name}
    </div>
    </RichCell> : null}
    </div>
    );

  return (
    <div>
     
      {content}
    </div>
  );
}

function Blog2(props) {
 
  const content = Object.keys(props.posts).map((post) =>
    <div key={post.user_id}>
  
     {post < 100 ? <RichCell
        before={<Avatar size={48} src={props.posts[post].photo} />}
        caption={`Баланс: ${parseFloat(props.posts[post].balance).toFixed(5)} PC`}
        after={Number(post) + 1}
      ><div style={{ display: 'flex' }}>
       {props.posts[post].name} 
        </div>
      </RichCell>: null}
       <FixedLayout vertical="bottom">
         <Div>
       <Button size="xl" mode="commerce" onClick={() => connect.send("VKWebAppAddToCommunity", {})}>Добавить в группу</Button>
     </Div>
        </FixedLayout>
    </div>
  );

  return (
    <div>
     
      {content}
    </div>
  );
}

const Top = props => (
  <Panel id={props.id} >
    <PanelHeader left={<PanelHeaderBack onClick={props.go} data-to='home' />}>Топ</PanelHeader>
    <Tabs>
              <TabsItem
                selected={props.tab === 'balance'}
                onClick={props.set}
                data-to='balance'
              >
               Баланс
              </TabsItem>
              <TabsItem
                selected={props.tab === 'speed'}
                onClick={props.set}
                data-to='speed'
              >
                Скорость
              </TabsItem>
              <TabsItem
                selected={props.tab === 'groups'}
                onClick={props.set}
                data-to='groups'
              >
                Группы
              </TabsItem>
            </Tabs>
    {props.tab === 'balance' && <Blog posts={props.top} pos={props.pos} />}
    {props.tab === 'speed' && <Blog1 posts={props.speedtop} pos={props.pos} />}
    {props.tab === 'groups' && <Blog2 posts={props.groups} pos={props.pos} />}
  </Panel>
);  

Top.propTypes = {
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

export default Top;
