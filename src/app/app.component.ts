import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'emoji-hub';
  searchInput:any;
  emojiList:any
  emojiSectionData:any = {
    activeCategoryIndex:0,
    SelectedEmoji:null,
    filterDebouncer:null
  }

  ngOnInit() {
    this.fetchDataFromApi()
  }


  fetchDataFromApi(){
     let url = `https://emojihub.yurace.pro/api/all`

     fetch(url,{method:"GET"}).then(res=>res.json()).then(data=>{
      console.log(data)
      data.forEach((emo:any)=>{
        emo.unicode[0]=`&#x${emo.unicode[0].slice(2)}`;
      })

      this.groupEmojis(data)
     })
  }

  groupEmojis(emojiList:any){
    let emoji_category = [...new Set(emojiList.map((obj:any) => obj.category))];
    this.emojiList = []
    emoji_category.forEach(cats=>{
      let category = {
        name:cats,
        groups:[]
      }
      category.groups = this.groupEmojisFromCategory(emojiList.filter((e:any)=>e.category == cats))
      this.emojiList.push(category)
    })
    console.log(this.emojiList)
  }

  groupEmojisFromCategory(categorisedEmojiList:any){
    let emoji_group = [...new Set(categorisedEmojiList.map((obj:any) => obj.group))]
    let groupList:any=[]
    emoji_group.forEach(group=>{
      let g ={
        name:group,
        emojis:categorisedEmojiList.filter((f:any)=>f.group == group),
        searchedEmojis:[]
      }
      groupList.push(g)
    })
    return groupList

  }

  activateCategory(index:any){
    this.emojiSectionData.activeCategoryIndex = index
  }

  setActiveEmoji(emoji:any){
    this.emojiSectionData.SelectedEmoji = emoji
  }

  filterEmoji(){
    if(this.searchInput.length>3){
      clearTimeout(this.emojiSectionData.filterDebouncer)
      this.emojiSectionData.filterDebouncer = setTimeout(()=>{
        this.filterDataForemoji()
      })
    }
    
  }
  filterDataForemoji(){
    this.emojiList[this.emojiSectionData.activeCategoryIndex].groups.forEach((gr:any)=>{
      gr.searchedEmojis = gr.emojis.filter((f:any)=>{
          const lowercaseItem = f.name.toLowerCase();
          return lowercaseItem.includes(this.searchInput);
      })
    })
  }
}
