import React from "react";

export default function HeadContent(props) {
  return (
    <div>
      <div className="hero anim">
        <div className="content">
          <h1 className="anim">{props.header}</h1>
          <h2 className="anim"> {props.subheader}</h2>
          <p className="anim">{props.Paragraph}</p>
          <form className="anim">{props.Form}</form>
          {props.Btn}
        </div>
        {props.image}
      </div>
    </div>
  );
}
