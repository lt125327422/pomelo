---
date: 2024-10-06
category:
  - graphics
tag:
  - basic
---

# The ray tracing
the other day ,I learn some topic about ray racing without opengl
or webgl etc. , with diving into this topic, I thought it's necessary
to write some article to reinforce my memory and comprehend to it, and 
what's the most important is to review this in the future , in spite of 
my english is poor , but I still want to try to write this article 
in english to also improve my skill in english , so if there is any incorrect
phrase or something , please don't blame it on me, i just a noob.


## The first principle of ray tracing 

### Framework

1. Place objects in scene
2. Set the camera up
3. Set up render image size and ratio (photo)
4. Render image (color3 image \[h] \[w] = Render(camera,image_size,scene))
5. Wait 1000/30 ms (for 30 fps)
6. Jump to step 4

Pseudocode
```
color3 image_pixels [image_w] [image_h] = camera.render(world)

hittable world [] = {
    sphere,
    plane,
}

sphere implements hittable

```

diffuse

light absorb

Diffuse Materials

`
ray_color(&ray,depth,&world){
    if(depth < 0){
        return vec3.zero();
    }

    hit_record;
    if(world.hit(&ray,interval(0,infinity),hit_record)){
        dir = random_on_hemisphere(record.normal);
        return .5 * ray_color(hit_record.point,depth - 1,dir);
    }

    return bgcolor();
}

`

the random point generated is uniformly distributed within the unit sphere

Uniform Distribution: Simply generating a random vector within a cube(like vec3::random(-1, 1))
would give you a non-uniform distribution when you project it onto a sphere. 
Many points would cluster near the center while others would be sparse toward the edges.

random_uniform_unit_vec(){
    while(true){
        
       rv =  vec3.random(-1,1);
        if(rv.length_sq <= 1 && rv.length_sq >= 1e33){
            return rv / sqrt(rv.length_sq);
        }
    }
}





Lambertian distribution
non-uniform Lambertian distribution

```
for(int i = 0; i < image_w; i += 1){
    for(int j = 0; j < image_h; j += 1){
        
        //  pixel center in viewport space
        auto pixel_center = pixel00_loc + (i * di) * (j * dj); 
        
        auto ray_dir = pixel_center - camera.origin; 
    
        color3 color = calc_color_by_ray(ray(ray_dir,camera.origin));
        
        write_color_to_image(color,i,j);
    }
}

```

sphere equation

x^2 + y^2 + z^2 = r^2


```
if(zero intersect point){

}else if(one intersect point){

}else if(two intersect point){
//  (in most case we take the nearest intersection point to camera, in other word, 

that the t is smaller is what we want)

}
```

we want to calc the intersection points when we cast a ray to scene from camera

is_hit_sphere() 

hit(camera.origin,camera_forward,min,max) -> hit_record()



## Basic components and classes
`Point3` the point in three dimension space \
`Vec3` the direction in 3d space \
`Color` the color with R , G , B channel \
`Ray` the description of the ray in 3d space combining with 
two fields origin point `Point3` and direction `Vec3`
`Interval` the combination of start and end in one dimension 
variable \

`Camera`

hit_record(point3 hit_point,vec3 normal,double t)

sphere : hittable
sphere_list : hittable


ray is inside the sphere
ray is outside the sphere

performance effect
objects in scene



``

## Basic Concepts

