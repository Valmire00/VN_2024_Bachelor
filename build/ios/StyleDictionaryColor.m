
//
// StyleDictionaryColor.m
//

// Do not edit directly
// Generated on Thu, 20 Jun 2024 19:09:40 GMT


#import ".h"

@implementation 

+ (UIColor *)color:()colorEnum{
  return [[self values] objectAtIndex:colorEnum];
}

+ (NSArray *)values {
  static NSArray* colorArray;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    colorArray = @[
#154ec1,
#767c88,
#3d9209,
#158de3,
#e42222,
#ffd43a,
#ffffff,
#ecf0f1,
#dee5f2,
#262824,
#0000001F,
#49a8ff,
#b3d4fc,
#ffc5274F,
#2364e7,
#5587ec,
#1347ae,
#7f828b,
#ffffff,
#f5f8f9,
#909399,
#ffffff,
#ffffff,
#ffffff,
#ffffff,
#154ec1,
#154ec1,
#154ec1,
#767c88,
#767c88,
#767c88,
#ffffff,
#ecf0f1,
#dee5f2,
#dee5f2,
#767c88,
#767c88,
#3d9209,
#3d9209,
#e42222,
#e42222,
#dee5f2,
#dee5f2,
#ecf0f1,
#ecf0f1,
#262824,
#767c88,
#767c88,
#ecf0f1,
#ecf0f1,
#ffffff,
#ffffff,
#ffffff,
#ecf0f1,
#ecf0f1,
#154ec1,
#262824,
#262824,
#767c88,
#ffffff,
#154ec1,
#e42222,
#154ec1,
#154ec1,
#ecf0f1
    ];
  });

  return colorArray;
}

@end
