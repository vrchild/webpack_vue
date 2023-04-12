#### git
1.  git init
2.  git config --global user.email "你的邮箱"
3.  git config --global user.name "你的名字"
4.  git remote add origin https地址
5.  git add .
6.  git commit -m "你的提交介绍 "
7.  git push -u origin master

####  如果报错,大概原因是：初始化项目时，远程仓库我建了README.md文件，而本地仓库与远程仓库尚未进行文件关联，因此需要将两个仓库的文件进行关联后提交。
1.  git pull
2.  git pull origin master
3.  git pull origin master --allow-unrelated-histories
4.  git push -u origin master -f
