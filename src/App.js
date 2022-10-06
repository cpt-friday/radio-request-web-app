import './App.css';
import React from 'react';


const reqEmpty = (req) => {
  return req.name.length === 0 || req.artist.length === 0 || req.req.length === 0;
}
const dateString = new Date().toISOString().slice(5, 10);
const displayString = (req, index) => {
  return `REQUEST #${index+1}\n"${req.name}" by ${req.artist}\nRequested by ${req.req}\n\nListen here at thecore.fm`;
}

const suffix = "\n\nListen here at the core.fm";

let rBlock = [];

const downloadFile = ({data, fileName, fileType}) => {
  const blob = new Blob([data], {type: fileType});
  const a = document.createElement('a');
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

const exportToJson = e => {
  e.preventDefault();
  if(rBlock.length === 0){
    alert("No request block to be exported");
    return;
  }
  downloadFile({
    data: JSON.stringify(rBlock),
    fileName: `${dateString}.json`,
    fileType: 'text/json'
  })
};

export default function App() {
  const [reqs, setReqs] = React.useState([]);
  const fileRef = React.useRef();
  return (
    <div className='MainMenu'>
      <h1>Radio Show Menu</h1>
      <SongList reqs={reqs} setReqs={setReqs} fileRef={fileRef}/>
      <TweetMenu />
    </div>
  );
}

function SongList({reqs, setReqs, fileRef}){
  const [add, setAdd] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  function handleAdd(){
    setAdd((prev) => !prev);
  }
  async function handleFile(e){
    if(e.target.files && e.target.files[0]){
      const inJSON = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(inJSON);
      reader.onload = () => {
        let inText = reader.result;
        let inBlock = JSON.parse(inText);
        inBlock.forEach(req => {
          rBlock.push({
            name: req.name,
            artist: req.artist,
            req: (req.req) ? req.req : req.requester
          })
          const inReq = {
            id: Math.random(),
            name: req.name,
            artist: req.artist,
            req: (req.req) ? req.req : req.requester
          };
          setReqs((prev) => {
            return prev.concat(inReq);
          })
        })
        setLoad((prev) => !prev);
      };
      reader.onerror = () => {
        console.log(reader.error);
      }
    }
  }
  function handleClear(){
    let conf = window.confirm("Are you sure you want to clear the request block?");
    if(conf){
      rBlock = [];
      setReqs((prev) => []);
    }
    else return;
  }
  return (
    <div className='SongRequestField'>
      <h2>List of Song Requests</h2>
      <button onClick={handleAdd}>Add Request</button>
      <button onClick={handleClear}>Clear Requests</button>
      { add && (<SongInput setReqs={setReqs} setVisible={setAdd}/>)}
      {reqs.length === 0 && <p>No requests! Add a song to get started</p>}
      <table className='RequestTable'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Artist</th>
            <th>Requester</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            reqs.map((req, index) =>{
              return(
                <tr key={req.id}>
                  <td>{index+1}</td>
                  <td>{req.name}</td>
                  <td>{req.artist}</td>
                  <td>{req.req}</td>
                  <td><DeleteSong req={req} setReqs={setReqs} /></td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <button onClick={exportToJson}>Export to JSON</button>
      { (load) ?
      (<input type="file" id="input_json" ref={fileRef} onChange={handleFile}/>)
        :
      (<button onClick={() => {
        setLoad((prev) => !prev);
      }}>Load from JSON</button>)
      }
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
      rBlock.push({
        name: elems.addName.value,
        artist: elems.addArtist.value,
        req: elems.addReq.value
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


function DeleteSong({req, setReqs}){
  function handleDelete(){
    const conf = window.confirm("Do you want to delete this request?");
    if(conf){
      rBlock.filter((r) => {
        return (r.name !== req.name && r.artist !== req.artist && r.req !== req.req);
      })
      setReqs((prev) => {
        return prev.filter((r) => r.id !== req.id);
      });
    }
  }
  return(
    <span className='deleteButton' onClick={handleDelete} role="button">X</span>
  )
}

//Tweet Menu

function TweetMenu(){
  const displayRef = React.useRef();
  const apiRef = React.useRef();
  let loaded = false;
  let index = 0;
  function handlePrep(index){
    if(rBlock.length === 0){
      alert("No Requests in block");
      return;
    }
    if(index >= rBlock.length){
      displayRef.current.innerHTML = "All requests launched!";
      if(index > rBlock.length) apiRef.current.innerHTML = "No more tweets to Launch";
      loaded = false;
      return;
    }
    displayRef.current.innerHTML = displayString(rBlock[index], index).replace(/\n/g, '<br />');
    loaded = true;
  }
  function handleLaunch(){
    if(!loaded){
      alert("Tweets Not Prepared");
      return;
    }
    else{
      const msg = {text: displayString(rBlock[index], index)};
      fetch("/tweetout", {
        method: 'post',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(msg)
      }).then((res) => res.status)
      .then((status) => {
        switch(status){
          case 200:
            apiRef.current.innerHTML = `Tweet #${index} Launched Successfully`;
            break;
          default:
            apiRef.current.innerHTML = `Tweet #${index} Failed to Launch`
        }
      });
      index++;
      handlePrep(index);
    }
  }
  return (
    <div className='TweetMenu'>
      <h2>Tweet Station</h2>
      <button onClick={() => handlePrep(index)}>Prepare Tweets</button>
      <div className='TweetDisplay'>
        <span ref={displayRef}>No Tweets Loaded Yet</span>
      </div>
      <button onClick={handleLaunch}>Launch Tweet</button>
      <div className='APIResponse'>
        <span ref={apiRef}>Tweets not launched</span>
      </div>
    </div>
  )
}