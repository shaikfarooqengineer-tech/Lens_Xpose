from PIL import Image
from pathlib import Path
p=Path('public/images')
for f in p.glob('*.png'):
 im=Image.open(f); im.thumbnail((2400,1400) if 'bg' in f.name or 'back' in f.name else (1200,1200));im.save(f.with_suffix('.webp'),quality=87,method=6)
for f in p.glob('*.jpg'):
 im=Image.open(f)
 for size in (800,1600):
  v=im.copy();v.thumbnail((size,size*2));v.save(p/(f.stem+'-'+str(size)+'.webp'),quality=86,method=6)
