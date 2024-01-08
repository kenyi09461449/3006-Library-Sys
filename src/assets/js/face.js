(function () {
    var faceJson = [
        {"faceID": "face0", "title": "Smile"},
        {"faceID": "face1", "title": "Uncomfortable"},
        {"faceID": "face2", "title": "Covet"},
        {"faceID": "face3", "title": "Daze"},
        {"faceID": "face4", "title": "Proud"},
        {"faceID": "face5", "title": "Tear"},
        {"faceID": "face6", "title": "Shy"},
        {"faceID": "face7", "title": "Silence"},
        {"faceID": "face8", "title": "Sleeping"},
        {"faceID": "face9", "title": "Cry"},
        {"faceID": "face10", "title": "Awkward"},
        {"faceID": "face11", "title": "Angry"},
        {"faceID": "face12", "title": "Mischievous"},
        {"faceID": "face13", "title": "Grin"},
        {"faceID": "face14", "title": "Surprised"},
        {"faceID": "face15", "title": "Sad"},
        {"faceID": "face16", "title": "Cool"},
        {"faceID": "face17", "title": "Cold Sweat"},
        {"faceID": "face18", "title": "Crazy"},
        {"faceID": "face19", "title": "Vomit"},
        {"faceID": "face20", "title": "Snicker"},
        {"faceID": "face21", "title": "Cute"},
        {"faceID": "face22", "title": "Roll Eyes"},
        {"faceID": "face23", "title": "Arrogant"},
        {"faceID": "face24", "title": "Hungry"},
        {"faceID": "face25", "title": "Sleepy"},
        {"faceID": "face26", "title": "Terrified"},
        {"faceID": "face27", "title": "Sweat"},
        {"faceID": "face28", "title": "Grin Foolishly"},
        {"faceID": "face29", "title": "Show Off"},
        {"faceID": "face30", "title": "Strive"},
        {"faceID": "face31", "title": "Curse"},
        {"faceID": "face32", "title": "Question"},
        {"faceID": "face33", "title": "Hush"},
        {"faceID": "face34", "title": "Dizzy"},
        {"faceID": "face35", "title": "Torture"},
        {"faceID": "face36", "title": "Dark face"},
        {"faceID": "face37", "title": "Skeleton"},
        {"faceID": "face38", "title": "Knock"},
        {"faceID": "face39", "title": "Goodbye"},
        {"faceID": "face40", "title": "Wipe Sweat"},
        {"faceID": "face41", "title": "Pick Nose"},
        {"faceID": "face42", "title": "Clap"},
        {"faceID": "face43", "title": "Embarrassed"},
        {"faceID": "face44", "title": "Grin Maliciously"},
        {"faceID": "face45", "title": "Left Hmm"},
        {"faceID": "face46", "title": "Right Hmm"},
        {"faceID": "face47", "title": "Yawn"},
        {"faceID": "face48", "title": "Despise"},
        {"faceID": "face49", "title": "Wronged"},
        {"faceID": "face50", "title": "About to Cry"},
        {"faceID": "face51", "title": "Sly"},
        {"faceID": "face52", "title": "Kiss"},
        {"faceID": "face53", "title": "Scared"},
        {"faceID": "face54", "title": "Pitiful"},
        {"faceID": "face55", "title": "Kitchen Knife"},
        {"faceID": "face56", "title": "Watermelon"},
        {"faceID": "face57", "title": "Beer"},
        {"faceID": "face58", "title": "Basketball"},
        {"faceID": "face59", "title": "Ping Pong"},
        {"faceID": "face60", "title": "Coffee"},
        {"faceID": "face61", "title": "Rice"},
        {"faceID": "face62", "title": "Pig"},
        {"faceID": "face63", "title": "Rose"},
        {"faceID": "face64", "title": "Wither"},
        {"faceID": "face65", "title": "Show Love"},
        {"faceID": "face66", "title": "Heart"},
        {"faceID": "face67", "title": "Heartbroken"},
        {"faceID": "face68", "title": "Cake"},
        {"faceID": "face69", "title": "Lightning"},
        {"faceID": "face70", "title": "Bomb"},
        {"faceID": "face71", "title": "Knife"},
        {"faceID": "face72", "title": "Soccer"},
        {"faceID": "face73", "title": "Ladybug"},
        {"faceID": "face74", "title": "Poop"},
        {"faceID": "face75", "title": "Moon"},
        {"faceID": "face76", "title": "Sun"},
        {"faceID": "face77", "title": "Gift"},
        {"faceID": "face78", "title": "Hug"},
        {"faceID": "face79", "title": "Thumbs Up"},
        {"faceID": "face80", "title": "Step On"},
        {"faceID": "face81", "title": "Handshake"},
        {"faceID": "face82", "title": "Victory"},
        {"faceID": "face83", "title": "Fist"},
        {"faceID": "face84", "title": "Seduce"},
        {"faceID": "face85", "title": "Fist Up"},
        {"faceID": "face86", "title": "Loser"},
        {"faceID": "face87", "title": "Rock"},
        {"faceID": "face88", "title": "First"},
        {"faceID": "face89", "title": "OK"},
        {"faceID": "face90", "title": "Love"},
        {"faceID": "face91", "title": "Blow Kiss"},
        {"faceID": "face92", "title": "Jump"},
        {"faceID": "face93", "title": "Shiver"},
        {"faceID": "face94", "title": "Angry Fire"},
        {"faceID": "face95", "title": "Turn Around"},
        {"faceID": "face96", "title": "Kowtow"},
        {"faceID": "face97", "title": "Look Back"},
        {"faceID": "face98", "title": "Jump Rope"},
        {"faceID": "face99", "title": "Wave Hand"}
    ];
  

  window.Face=function(option) {
      var deafultOpt={
          el:document.querySelector("body"),
          callBack:function () {}
      }
      deafultOpt=option;
      this.opt=deafultOpt;
      this.init();
  }
  Face.prototype={
      Constructor: Face,
      init:function () {
          var _this=this;
          var facePanel=document.createElement("ul");
          var faceWarp=document.createElement("div");
          facePanel.className="face-panel";
          faceWarp.className='face-warp';
          faceWarp.appendChild(facePanel);
          _this.opt.el.appendChild(faceWarp);
          for(var i=0;i<faceJson.length;i++){
              var face=faceJson[i];
              var li=document.createElement("li");
              li.className="face "+face.faceID;
              li.title=face.title;
              (function (face) {
                  li.addEventListener('click',function (e) {
                      _this.opt.callBack(face,faceWarp);
                      e.preventDefault()
                      e.stopPropagation();
                  });
              })(face)
              facePanel.appendChild(li);
          }
          _this.opt.el.addEventListener("click",function (e) {
              faceWarp.style.display="block";
              e.preventDefault()
              e.stopPropagation();

          });
          document.addEventListener("click",function (e) {
              faceWarp.style.display="none";
          })

      },
      replaceFace:function (text) {
          for(var i=0;i<faceJson.length;i++){
              var face=faceJson[i];
              var str="<span class='face "+face.faceID+"' title='"+face.title+"'></span>";
              var str1='〖'+face.title+'〗';
              var reg = new RegExp(str1,"g");
              text=text.replace(reg,str);
          }
          return text;
      }
  }
})(window)