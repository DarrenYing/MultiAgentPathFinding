
# 多Agent路径规划仿真系统

针对多AGV物流分拣场景建立的仿真模拟系统，是我的本科毕业设计，开源以作纪念。


## Documentation

[系统文档](https://darren-ying.gitbook.io/multi-agent-system/)

  
## Demo

[在线尝试](https://mapf-cbs-ying.netlify.app/)


## Screenshots

![image-20210613195542733.png](https://i.loli.net/2021/06/13/63rn2QgBouTDdVI.png)
## Installation

本系统使用p5.js编写，推荐使用atom等支持该语言的IDE编辑。

下载IDE后，下载插件
```bash
  File -> Settings -> Packages
  
  Search p5js-toolbar and Install it
```

## Run Locally

完成后开启p5js-toolbar
```bash
  Packages -> p5js-toolbar -> Toggle p5.js toolbar

  Click the run button and that's all
```   
## Optimizations

### V1.0	

算法基本实现，逻辑已基本无bug

输入 ：

* agent：start，end
* obstacles
* map：rows，cols

输出：

* 如果没冲突，给出每个agent的路径数组

#### 待实现

UI界面，参数调整接口，单步模式和直接运行模式。



### V1.1

UI界面初步完成，目前提供参数如下：

* 地图行数、列数、障碍物比例
* 障碍物、每辆小车的起点和终点都可以自由设定
* 运行功能（直接执行模式）和重置功能



### V1.15

UI界面进一步完善，加入如下功能：

* 可以添加小车
* 添加单步执行模式
* 显示当前运行状态

#### 待实现

删除小车功能，设定小车颜色（可选），加入预设的特殊布局地图、计时功能。



### V1.2

删除小车功能完成

#### 问题记录

![image-20201119153155889](C:\Users\AA\AppData\Roaming\Typora\typora-user-images\image-20201119153155889.png)

如图所示情况，绿色小车到达终点后，在实际情况中会离开，继续执行下一个任务，但在路径中，绿车停靠在终点，会和红车路径不断产生冲突，导致死循环，这是不合理的。

#### 解决方案

* 每个小车有一个任务列表，执行完一个就去做下一个。
* 在补全小车路径到maxT时，补为特殊点，即不会再和其它小车冲突的点。



### V1.25

删除小车bug修复，计时功能初步完成，修改小车速度功能完成

#### 关于计时功能

对于单轮任务，需要对每个Agent的执行时间单独计时

最好拓展到多轮任务，对任务直接计时

#### 待实现

* 打算先完善前端UI，优化排版，加一些对用户友好的提示功能。
* 添加小车时自定义颜色，给一个colorpicker。



### V1.28

UI第一次更新完成

#### 优化思路

不必通过draw一直重画整个界面，setup时调用noloop，然后之后封装一个drawWholeThing，当需要更新界面时，再调用即可，减小开销。

#### 其他

把全局变量封装到一个config.js里，优化代码结构，能用lodash里的函数代替的尽量代替

#### 待实现

等V1.2的bug修复后，就开始改进算法，并做对比试验

从yaml文件读取地图（待定）



### V1.29

![image-20201122164738188](C:\Users\AA\AppData\Roaming\Typora\typora-user-images\image-20201122164738188.png)



### V1.30

UI界面的逻辑bug基本修复，UI样式初步调整完毕，全局变量存到configs.js中。

#### 待实现

输出每个AGV的等待次数，转弯次数等，设定每个小车的开始时间不一致

小车密度，20*20,障碍物比例为0.2时，4-5辆AGV同时运行比较合适。



### V1.31

可以输出每个AGV的等待次数与转弯次数

#### 待实现

算法优化，测试地图的设计，要降低计算复杂度，想办法更精确地比较实际效率



### 优化思路记录

#### 简单优化

* 在分裂CT Node时，下层路径不需要全部重新计算，只计算受影响的路径
* 加入全局冲突表
* 转弯代价和重复路径代价（先尝试简单处理）

#### 进一步优化

* 上层CT Tree在迭代时，当一个CT Node需要分裂时，有选择性地选择一个冲突来分裂，cardinal conflict。
* 加入BP（Bypass），每个CT Node多记录一个NC，即自己的solution中的冲突数量，当一个CT Node需要分裂时，可以先假分裂，如果分裂后的solution能够在满足原先约束的情况下减少冲突数量，就直接将这个假分裂的节点的新路径替换原先的CT Node中的路径，然后这个CT Node就不分裂了。



### Bug修复记录

* 按钮UI重复创建的bug已修复
* 可以保存地图，但碍于JS较难操作文件，仅在控制台输出为JSON格式，需要手动append到地图文件中

### 优化与设想

* 考虑加入模式切换功能，提供测试模式和用户输入模式，测试模式的用途是为测试专门的地图提供便利，交互方式还在考虑中。
* 加入算法切换按钮，便于记录算法迭代变化，同时便于比较执行效果。UI上考虑放在地图左侧。



### V1.35

新增功能：

* 可以切换运行模式
  * 用户模式：默认模式，地图根据用户设定随机生成
  * 测试模式：后台提供一些测试地图，命名格式为：map_8by8_12_1_ex0，其中8为地图行数，12为障碍物数，1为agent数量，ex0表示实验0，目前已提供的地图主要有8by8和32by32，ex可以从0到99，具体可以查看CommonMapSettings.js文件
* no solution时，重置即可，不会停止循环，算是bug修复吧
* 保存地图（不完善），由于js读写本地文件不便，目前只是将当前地图配置输出到控制台，需要复制到CommonMapSettings.js文件中再赋值给变量，然后才能在测试模式中调用



### V1.40

* 修复复选框选项显示bug，修复单步模式bug
* 在用户模式下添加“小车数量”的自定义项
* 更新UI界面头部排版
* 后期数据测试：
  * 原版：dirs默认，无转弯代价，cbs上层重复计算
  * 优化：dirs更新，转弯代价，cbs上层减少重复计算，Astar下层优先选择h值小者




### 目前准备的实验地图

* 8*8，obstacle：1%，agents：2,3,4,5,6,7
  * 每个5组
* 8*8，obstacle：1%，agents：2,3,4,5,6,7
  * 每个5组
* 20*20，obstacle：1%，agents：4,8,12,16,20
  * 每个3组
* 20*20，obstacle：10%，agents：4,8,12
  * 每个4组
* 50*50，obstacle：1%，agents：10,15,20,25,30
  * 每个3组
* 8*8，100组
* 32*32，100组

### 实验结果
**8x8 障碍物比例1%**
![image-20210613201936321](https://i.loli.net/2021/06/13/JvoeQMaYt6UVmns.png)

**20x20 障碍物比例1%**
![image-20210613202129716](https://i.loli.net/2021/06/13/j7DTZpWJXCIkQdf.png)

**50x50 障碍物比例1%**
![image-20210613202224692](https://i.loli.net/2021/06/13/JkneCo3Xj8HEVfN.png)

### V2.0
* 地图的生成与导出
* Agent的增删与速度调整
* 运行场景自由编辑
* 批量自动化测试（不够完善）
* 系统状态及执行过程可视化
* 数据统计及下载
* 详细的系统文档
  
## Authors

- [@DarrenYing](https://www.github.com/DarrenYing)
## Support

For support, email ying_nt@qq.com or submit issues.

  
## Appendix

### 参考文献
[1] Sharon G, Stern R, Goldenberg M, et al. The increasing cost tree search for optimal multi-agent pathfinding[J]. Artificial Intelligence, 2013, 195: 470-495.

[2] Sharon G, Stern R, Felner A, et al. Conflict-based search for optimal multi-agent pathfinding[J]. Artificial Intelligence, 2015, 219: 40-66.

[3] Boyarski E, Felner A, Stern R, et al. Icbs: The improved conflict-based search algorithm for multi-agent pathfinding[C]//Eighth annual symposium on combinatorial search. 2015.

### 一些感想
算法主要在开题前(2020.10)完成，寒假(2021.2)完善了系统功能，开学后就是测试和调bug，以及写论文(2021.3)

十分感谢shiffman的p5.js教程，讲课生动有趣，容易理解，给出的A*算法案例对我帮助很大

开发过程比较细碎，主要在忙导师的其他项目，不过这个项目也是我第一个比较认真且独立完成的Demo，如果它能帮助到你或给你启发，那就再好不过了ξ( ✿＞◡❛)


哈哈都看到这里了，能给个star嘛(⸝⸝•‧̫•⸝⸝)


  