#!/usr/bin/env python3
"""
Generates high-resolution macOS .icns file for AA Fourth Step Inventory
"""
import zlib, struct, math, os, sys, subprocess

def create_master_png(output_path, size=1024):
    width, height = size, size
    pixels = bytearray(width * height * 4)
    cx, cy = width / 2.0, height / 2.0
    
    squircle_r = size * 0.44
    outer_circle_r = size * 0.38
    inner_circle_r = size * 0.34
    
    tri_r = inner_circle_r * 0.95
    p1 = (cx, cy - tri_r)
    p2 = (cx + tri_r * 0.866025, cy + tri_r * 0.5)
    p3 = (cx - tri_r * 0.866025, cy + tri_r * 0.5)
    
    def dist_to_segment(px, py, x1, y1, x2, y2):
        l2 = (x2 - x1)**2 + (y2 - y1)**2
        if l2 == 0: return math.hypot(px - x1, py - y1)
        t = max(0.0, min(1.0, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2))
        proj_x = x1 + t * (x2 - x1)
        proj_y = y1 + t * (y2 - y1)
        return math.hypot(px - proj_x, py - proj_y)

    for y in range(height):
        dy = y - cy
        grad_factor = y / float(height)
        
        for x in range(width):
            dx = x - cx
            dist = math.sqrt(dx * dx + dy * dy)
            idx = (y * width + x) * 4
            
            sq_x = dx / squircle_r
            sq_y = dy / squircle_r
            sq_val = sq_x**4 + sq_y**4
            
            if sq_val <= 1.05:
                alpha_edge = 1.0
                if sq_val > 0.98:
                    alpha_edge = max(0.0, min(1.0, (1.05 - sq_val) / 0.07))
                
                r_base = int(24 + grad_factor * 12)
                g_base = int(48 + grad_factor * 20)
                b_base = int(36 + grad_factor * 16)
                
                r, g, b, a = r_base, g_base, b_base, int(255 * alpha_edge)
                
                if abs(dist - (outer_circle_r + inner_circle_r) / 2.0) <= (outer_circle_r - inner_circle_r) / 2.0:
                    highlight = 1.0 - (dy / outer_circle_r) * 0.3
                    r = min(255, int(218 * highlight))
                    g = min(255, int(175 * highlight))
                    b = min(255, int(45 * highlight))
                elif dist < inner_circle_r:
                    d_edge1 = dist_to_segment(x, y, p1[0], p1[1], p2[0], p2[1])
                    d_edge2 = dist_to_segment(x, y, p2[0], p2[1], p3[0], p3[1])
                    d_edge3 = dist_to_segment(x, y, p3[0], p3[1], p1[0], p1[1])
                    min_tri_dist = min(d_edge1, d_edge2, d_edge3)
                    
                    tri_stroke = size * 0.016
                    if min_tri_dist <= tri_stroke:
                        r, g, b = 238, 195, 65
                    else:
                        angle = math.atan2(dy, dx)
                        max_len = inner_circle_r * 0.65
                        
                        if dist <= size * 0.04:
                            r, g, b = 250, 225, 120
                        elif dist <= max_len and (abs(dx) < size * 0.02 or abs(dy) < size * 0.02):
                            r, g, b = 240, 205, 80
                        else:
                            r = int(18 + grad_factor * 8)
                            g = int(36 + grad_factor * 12)
                            b = int(28 + grad_factor * 10)
                
                pixels[idx] = r
                pixels[idx+1] = g
                pixels[idx+2] = b
                pixels[idx+3] = a
            else:
                pixels[idx] = 0
                pixels[idx+1] = 0
                pixels[idx+2] = 0
                pixels[idx+3] = 0

    raw = bytearray()
    for y in range(height):
        raw.append(0)
        raw.extend(pixels[y * width * 4 : (y + 1) * width * 4])
    compressed = zlib.compress(raw, 9)
    
    png = bytearray([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png.extend(struct.pack('>I', 13) + b'IHDR' + ihdr + struct.pack('>I', zlib.crc32(b'IHDR' + ihdr)))
    png.extend(struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', zlib.crc32(b'IDAT' + compressed)))
    png.extend(struct.pack('>I', 0) + b'IEND' + struct.pack('>I', zlib.crc32(b'IEND')))
    
    with open(output_path, 'wb') as f:
        f.write(png)

def build_icns(output_icns_path):
    temp_png = '/tmp/master_icon_1024.png'
    iconset_dir = '/tmp/AAAppIcon.iconset'
    os.makedirs(iconset_dir, exist_ok=True)
    
    print('  -> Drawing 1024x1024 master icon...')
    create_master_png(temp_png, 1024)
    
    print('  -> Scaling iconset sizes...')
    sizes = [
        (16, 'icon_16x16.png'),
        (32, 'icon_16x16@2x.png'),
        (32, 'icon_32x32.png'),
        (64, 'icon_32x32@2x.png'),
        (128, 'icon_128x128.png'),
        (256, 'icon_128x128@2x.png'),
        (256, 'icon_256x256.png'),
        (512, 'icon_256x256@2x.png'),
        (512, 'icon_512x512.png'),
        (1024, 'icon_512x512@2x.png')
    ]
    
    for sz, name in sizes:
        dest = os.path.join(iconset_dir, name)
        subprocess.run(['sips', '-z', str(sz), str(sz), temp_png, '--out', dest], capture_output=True, check=True)
        
    print('  -> Compiling to Apple ICNS with iconutil...')
    subprocess.run(['iconutil', '-c', 'icns', iconset_dir, '-o', output_icns_path], check=True)
    print(f'  -> Created {output_icns_path} ({os.path.getsize(output_icns_path):,} bytes)')

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '/tmp/AppIcon.icns'
    build_icns(out)
