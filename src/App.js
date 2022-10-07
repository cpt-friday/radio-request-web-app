import './App.css';
import React from 'react';


const reqEmpty = (req) => {
  return req.name.length === 0 || req.artist.length === 0 || req.req.length === 0;
}
const dateString = new Date().toISOString().slice(5, 10);


let rBlock = [];
let sBlock = [];
let msg = "";
let index = 0;
let pushed = [false, false, false, false];

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

export default function App() {
  const [reqs, setReqs] = React.useState([]);
  const fileRef = React.useRef();
  return (
    <div className='MainMenu'>
      <h1>Radio Show Menu</h1>
      <TweetMenu reqs={reqs} setReqs={setReqs} />
      <SongList reqs={reqs} setReqs={setReqs} fileRef={fileRef}/>
    </div>
  );
}

function TweetMenu({reqs, setReqs}){
  const [tweetStrings, setStrings] = React.useState([]);
  const [edit, setEdit] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [table, setTable] = React.useState(false);
  const [prep, setPrep] = React.useState(false);
  const [meta, setMeta] = React.useState(true);
  const displayRef = React.useRef();
  const apiRef = React.useRef();
  const handleEdit = () => {setEdit((prev) => !prev);};
  const metaTweetBuilder = (body, suffix) => `${body}\n${suffix}`;
  const reqTweetBuilder = (req, index, suffix) => `REQUEST #${index}\n"${req.name}" by ${req.artist}\nRequested by ${req.req}\n${suffix}`; 
  const exportStrings = () => {
    if(tweetStrings.length === 0){
      alert("No tweet strings to export");
      return;
    }
    downloadFile({
      data: JSON.stringify(tweetStrings),
      fileName: "strings.json",
      fileType: 'text/json'
    })
  };
  async function handleFile(e){
    if(e.target.files && e.target.files[0]){
      const inJSON = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(inJSON);
      reader.onload = () => {
        let inText = reader.result;
        let inStrings = JSON.parse(inText);
        setLoad((prev) => !prev);
        inStrings.forEach((string) => {
          sBlock.push(string.replace(/\\n/, '\n'));
          setStrings((prev) => {
            return prev.concat(string);
          });
        })
      }
      reader.onerror = () => {
        console.log(reader.error);
      }
    }
  }
  function handleSubmit(e){
    e.preventDefault();
    const elems = e.target.elements;
    sBlock = [
      elems.suffix.value,
      elems.intro.value,
      elems.callout.value,
      elems.cutoff.value
    ];
    setStrings((prev) => {
      return prev = [
        elems.suffix.value,
        elems.intro.value,
        elems.callout.value,
        elems.cutoff.value
      ];
    })
    setEdit((prev) => !prev);
  }
  function prepMeta(sInd){
    if(prep){
      alert("Tweet already prepped");
      return;
    }
    if(sBlock < 4){
      alert("Meta strings not entered");
      return;
    }
    if(meta === false) setMeta((prev) => !prev);
    msg = metaTweetBuilder(sBlock[sInd], sBlock[0]);
    displayRef.current.innerText = msg;
    setPrep((prev) => !prev);
    pushed[sInd-1] = false;
  }
  function prepRequest(){
    if(sBlock.length === 0){
      alert("Tweet Strings not loaded");
      return;
    }
    if(rBlock.length === 0){
      alert("No requests in block");
      return;
    }
    if(index >= rBlock.length){
      displayRef.current.innerText = "All requests tweeted out!";
      index = 0;
      pushed[3] = false;
      setPrep((prev) => !prev);
      return;
    }
    if(meta === true) setMeta((prev) => !prev);
    msg = reqTweetBuilder(rBlock[index], index+1, sBlock[0]);
    displayRef.current.innerText = msg;
    if(index === 0) setPrep((prev) => !prev);
  }
  function launchTweet(text, meta){
    console.log(text);
    if(!meta){
      const updated = reqs.map((item) => {
        if(item.id === index){
          const updatedItem = {
            ...item,
            status: !item.status,
          };
          return updatedItem;
        }
        return item;
      });
      setReqs(updated);
      index++;
      prepRequest();
      return;
    }
    else {
      setPrep((prev) => !prev);
      displayRef.current.innerText = "No Tweets Loaded";
    }
  }
  return (
    <div className='TweetMenu'>
      <h2>Tweet Station</h2>
      <div className='PrepButtons'>
        {!pushed[0] && (<button onClick={() => prepMeta(1)}>Prepare Intro</button>)}
        {!pushed[1] && (<button onClick={() => prepMeta(2)}>Prepare Callout</button>)}
        {!pushed[2] && (<button onClick={() => prepMeta(3)}>Prepare Cutoff</button>)}
        {!pushed[3] && (<button onClick={() => {index = 0; prepRequest();}}>Prepare Requests</button>)}
      </div>
      <div className='Displays'>
        <div className='TweetDisplay'>
          <span ref={displayRef}>No Tweets Loaded</span>
        </div>
        <div className='APIDisplay'>
          <span ref={apiRef}>Prep = {prep ? ("True") : ("False")}</span>
        </div>
      </div>
      {prep && (<button onClick={() => launchTweet(msg, meta)}>Launch Tweet</button>)}
      <div className='MetaButtons'>
        <button onClick={handleEdit}>Edit Tweet Strings</button>
        {tweetStrings.length !== 0 && (<button onClick={() => {setTable((prev) => !prev)}}>View Tweet Strings</button>)}
        <button onClick={exportStrings}>Export Tweet Strings to JSON</button>
        { tweetStrings.length === 0 && (
          (load) ?
          (<input type='file' id='input_json' onChange={handleFile}/>)
          : (<button onClick={() => setLoad((prev) => !prev)}>Import Tweet Strings from JSON</button>)
        )}
      </div>
      {edit && (<div className='EditFields'>
        <form onSubmit={handleSubmit}>
          <input name="suffix" placeholder='Enter Suffix for tweets'></input>
          <input name="intro" placeholder='Enter Intro Tweet Body'></input>
          <input name="callout" placeholder='Enter Callout Tweet Body'></input>
          <input name="cutoff" placeholder='Enter Cutoff Tweet Body'></input>
          <button type='submit'>Submit</button>
          <button>Cancel</button>
        </form>
      </div>)}
      {table && (<table className='TweetStringTable'>
          <thead>
            <tr>
              <th>String</th>
            </tr>
          </thead>
          <tbody>
            {
              tweetStrings.map((string) => {
                return(
                  <tr key={tweetStrings.indexOf(string)}>
                    <td>{string}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>)}
    </div>
  )
}

function SongList({reqs, setReqs, fileRef}){
  const [add, setAdd] = React.useState(false);
  const [load, setLoad] = React.useState(false);
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
            id: index,
            name: req.name,
            artist: req.artist,
            req: (req.req) ? req.req : req.requester,
            status: false
          };
          setReqs((prev) => {
            return prev.concat(inReq);
          })
          index++;
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
  const exportBlock = () => {
    if(rBlock.length === 0){
      alert("No request block to be exported");
      return;
    }
    downloadFile({
      data: JSON.stringify(rBlock),
      fileName: `${dateString}.json`,
      fileType: 'text/json'
    })
  }
  return (
    <div className='SongRequestField'>
      <h2>List of Song Requests</h2>
      <button onClick={() => setAdd((prev) => !prev)}>Add Request</button>
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
            <th>Tweeted</th>
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
                  <td>{req.status ? ("Yes") : ("No")}</td>
                  <td><DeleteSong req={req} setReqs={setReqs} /></td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <button onClick={exportBlock}>Export to JSON</button>
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
      id: index,
      name: elems.addName.value,
      artist: elems.addArtist.value,
      req: elems.addReq.value,
      status: false
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