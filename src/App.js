import './App.css';
import React from 'react';

const displayString = (req) => {return `${req.name} - ${req.artist} (${req.req})`};
const reqEmpty = (req) => {
  return req.name.length === 0 || req.artist.length === 0 || req.req.length === 0;
}

export default function App() {
  const [reqs, setReqs] = React.useState([
    {id: 0, name: "When You Sleep", artist:"My Bloody Valentine", req:"@juicyjackDJ"},
    {id: 1, name: "Buddy Holly", artist:"Weezer", req:"@Weezerfan1994"},
    {id: 2, name: "Doin Your Mom!", artist:"Fatty Spins", req:"@JoeBiden"}
  ]);
  return (
    <div className='MainMenu'>
      <h1>Radio Show Menu</h1>
      <SongList reqs={reqs} setReqs={setReqs} />
    </div>
  );
}

function SongList({reqs, setReqs}){
  const [add, setAdd] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  function handleAdd(){
    setAdd((prev) => !prev);
  }
  function handleEdit(){
    setEdit((prev) => !prev);
  }
  return (
    <div className='SongListField'>
      <h2>List of Song Requests</h2>
      <button onClick={handleAdd}>Add Request</button>
      { add && (<SongInput setReqs={setReqs} setVisible={setAdd}/>)}
      <button onClick={handleEdit}>Edit Request</button>
      <ol>
        {reqs.map((req) => (
          <div className='SongField' key={req.id}>
            <li>{displayString(req)}</li>

          </div>
        ))}
      </ol>
    </div>
  );
}

function SongInput({setReqs, setVisible}){
  const inName = React.useRef();
  const inArtist = React.useRef();
  const inReq = React.useRef();
  function handleSubmit(event){
    event.preventDefault();
    const elems = event.target.elements;
    const req = {
      id: Math.random(),
      name: elems.addName.value,
      artist: elems.addArtist.value,
      req: elems.addReq.value
    };
    if(!reqEmpty(req)){
      setReqs((prev) => {
        return prev.concat(req);
      });
      inName.current.value = "";
      inArtist.current.value = "";
      inReq.current.value = "";
      setVisible();
    }
  }
  function handleCancel(){
    inName.current.value = "";
    inArtist.current.value = "";
    inReq.current.value = "";
    setVisible();
  }
  return(
    <form onSubmit={handleSubmit}>
      <input name="addName" placeholder="Enter Song Name Here" ref={inName}></input>
      <input name="addArtist" placeholder="Enter Song Artist Here" ref={inArtist}></input>
      <input name="addReq" placeholder="Enter Requester Name/Twitter Handle" ref={inReq}></input>
      <button type="submit">Submit Request</button>
      <button onClick={handleCancel}>Cancel</button>
    </form>
  )
}