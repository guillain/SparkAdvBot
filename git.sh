#!/bin/bash
VERSION="1.0.3"
USER='guillain'

add(){
  echo "add: ${1}, comment: ${2}"
  git add -f "${1}"
  git commit -m "${2}" "${1}"
}

git pull
add package.json	"App definition and packages requirement, ${VERSION}"
add config.js.default	"Template config file, to copy in config.js, ${VERSION}"
add sparkbotadv.js	"Main script, to run with 'node sparkbotadv.js', ${VERSION}"
add myCrisisRoom.js 	"Crisis Room functions, ${VERSION}"
add myServiceDesk.js	"Service Desk functions, ${VERSION}"
add myVote.js		"Vote functions, ${VERSION}"
add myAI.js		"AI functions, ${VERSION}"
add myAlert.js          "Alert functions, ${VERSION}"
add myBotMgr.js         "Bot mgr functions, ${VERSION}"
add mySearch.js		"Search functions, ${VERSION}"
add myTranslate.js	"Functions for translation, ${VERSION}"
add myConfig.js 	"Config display functions, ${VERSION}"
add app 		"Shell script to run the app, ${VERSION}"
add LICENSE		"License file"
add README.md		"readme file, ${VERSION}"
add todo.md		"ToDo list of improvements or bugs, ${VERSION}"
add .gitignore		"Local file to ignore, ${VERSION}"
add git.sh		"File to commit files of the app"
git push

# echo "Publish under version: ${VERSION}"
#npm login ${USER}
#npm version ${VERSION}
#npm publish
