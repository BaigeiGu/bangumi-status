# bangumi-status
一个基于CloudFlare Workers 用于观测哔哩哔哩番剧统计数据的脚本

## 功能
* 自动观测哔哩哔哩番剧统计数据
* 导出为JSON格式

## 部署

### 创建 KV
进入 Cloudflare Dashboard，点击 ``Workers 和 Pages > KV`` ，创建一个命名空间。

### 创建 Workers
点击 ``Workers 和 Pages > 概述 > 创建应用程序`` 以创建一个应用程序，粘贴``workers.js``文件中所有内容。修改文件开始处的 `bangumi_id` 为需要统计的番剧的ID（可通过番剧页面url查询）。

在创建好的应用程序页面点击 ``设置 > 变量``，在 ``KV 命名空间绑定`` 中添加绑定。变量名称必须为 ``KV``。

### 定时任务

在创建好的应用程序页面点击 ``设置 > 触发器``，在 ``Cron 触发器`` 中添加 Cron 触发器，Cron 语法请自行搜索了解。

## 使用

### 查询
`/get` 用于查询所有数据的键（即记录时的时间戳）。

`/get/values` 用于查询所有详细数据。

### 更新

`/update` 用于立即执行一个更新任务。
