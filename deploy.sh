git checkout --orphan dist
git --work-tree dist add --all
git --work-tree dist commit -m"Deploy"
git push origin HEAD:dist --force
#rm -r dist
git checkout -f master
git branch -D dist
