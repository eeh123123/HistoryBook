1 导入的简略写法
@import 'color' === @import 'color.scss'

2 局部文件，只存放css变量。 特征是名字以下划线开头。引入方法：

@imoort 'themes/_night-sky.scss' === @import 'themes/night-sky'


3 混合器，使用@mixin标识符定义

@mixin rounded-corners {
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

使用方法：
notice {
  background-color: green;
  border: 2px solid #00aa00;
  @include rounded-corners;
}

//实例，混合器叫when,$state是参数
@mixin when($state) {
  @at-root {
    &.#{$state-prefix + $state} {
      @content;
    }
  }
}


4 给混合器传参
 @mixin link-colors($normal, $hover, $visited) {
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}

使用方法：

a {
  @include link-colors(blue, red, green);
}

//Sass最终生成的是：

a { color: blue; }
a:hover { color: red; }
a:visited { color: green; }

注意：当你@include混合器时，有时候可能会很难区分每个参数是什么意思，参数之间是一个什么样的顺序。为了解决这个问题，sass允许通过语法$name: value的形式指定每个参数的值。这种形式的传参，参数顺序就不必再在乎了，只需要保证没有漏掉参数即可：

a {
    @include link-colors(
      $normal: blue,
      $visited: green,
      $hover: red
  );
}

5 默认参数值
为了在@include混合器时不必传入所有的参数，我们可以给参数指定一个默认值。参数默认值使用$name: default-value的声明形式，默认值可以是任何有效的css属性值，甚至是其他参数的引用，如下代码：

@mixin link-colors(
    $normal,
    $hover: $normal,
    $visited: $normal
  )
{
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}
如果像下边这样调用：@include link-colors(red) $hover和$visited也会被自动赋值为red。

混合器只是sass样式重用特性中的一个。我们已经了解到混合器主要用于样式展示层的重用，如果你想重用语义化的类呢？这就涉及sass的另一个重要的重用特性：选择器继承。

6 通过选择器继承继承样式

.error {
  border: 1px solid red;
  background-color: #fdd;
}
.seriousError {
  @extend .error;
  border-width: 3px;
}

在上边的代码中，.seriousError将会继承样式表中任何位置处为.error定义的所有样式。

建议：尽量不要在继承中使用后台选择器


7 @at-root
上面是没有使用@at-root命令的默认情况。

.parent{
  color:red;
  @at-root .child {
    width:200px;
    height:50px;
  }
}
上面的代码编译成css代码如下:

.parent {
  color: red;
}
.child {
  width: 200px;
  height: 50px; 
}
由于使用@at-root命令，那么.child就不参与嵌套，直接跳出嵌套。

.parent {
  background:red;
  @at-root {
    .child-1 {
      width:200px;
      height:100px;
    }
    .child-2 {
      width:150px;
      height:50px;
    }
  }
}
编译成css代码实例如下:


.parent {
  background: red; 
}
.child-1 {
  width: 200px;
  height: 100px; 
}
.child-2 {
  width: 150px;
  height: 50px; 
}


四个系统变量
$namespace: 'el';
$element-separator: '__';
$modifier-separator: '--';
$state-prefix: 'is-';

@mixin when($state) {
  @at-root {
    &.#{$state-prefix + $state} {
      @content;
    }
  }
}

1度转换：

@mixin when($state) {
  @at-root {
    &.#{'is-'+ $state} {
      @content;
    }
  }
}


@include when(dark) {
    .el-alert__closebtn {
      color: $--color-white;
    }
    .el-alert__description {
      color: $--color-white;
    }
  }



.is-dark{
    .el-alert__closebtn {
      color: $--color-white;
    }
    .el-alert__description {
      color: $--color-white;
    }
}



7 @content 用法
向混合样式中导入内容 (Passing Content Blocks to a Mixin)
在引用混合样式的时候，可以先将一段代码导入到混合指令中，然后再输出混合样式，额外导入的部分将出现在 @content 标志的地方：

@mixin apply-to-ie6-only {
  * html {
    @content;
  }
}
@include apply-to-ie6-only {
  #logo {
    background-image: url(/logo.gif);
  }
}