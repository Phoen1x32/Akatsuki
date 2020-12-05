import React from "react";
import vkConnect from "@vkontakte/vk-bridge";

import { Panel, Button, Group, Div, Footer, Placeholder, RichCell, Avatar, PanelHeader, FormLayoutGroup, FormLayout, Input, PanelHeaderBack, CardScroll, PanelHeaderButton, Gallery, Gradient, Banner, Search, InfoRow, Progress, List, Cell, Header, Tooltip, FormStatus, CardGrid, Card } from '@vkontakte/vkui';

import Icon24Linked from "@vkontakte/icons/dist/24/linked";

function Blog(props) {
 
  const content = Object.keys(props.posts).map((post) =>
    <div key={post.user_id}>

    {props.posts[post].operation === 'in' ? <RichCell
        before={<Avatar size={48} src={props.posts[post].from_photo} />}
        after={`+ ${props.posts[post].sum} PC`}
      >
        {props.posts[post].from_name}
      </RichCell> : <RichCell
        before={<Avatar size={48} src={props.posts[post].to_photo} />}
        after={`- ${props.posts[post].sum} PC`}
      >
       	{props.posts[post].to_name}
      </RichCell>}
  	</div>
  );

  return (
    <div>
     
      {content}
    </div>
  );
}


const History = props => (
	<Panel id={props.id}>
		<PanelHeader left={<PanelHeaderBack onClick={props.go} data-to='other' />}>История переводов</PanelHeader>
		<Blog posts={props.history} />
	</Panel>
);

export default History;