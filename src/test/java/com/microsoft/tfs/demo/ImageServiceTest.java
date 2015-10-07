/**
 * ------------------------------------------ START OF LICENSE -----------------------------------------
 *
 * Deep-Space
 *
 * Copyright (c) Microsoft Corporation
 *
 * All rights reserved.
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the ""Software""), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * ----------------------------------------------- END OF LICENSE ------------------------------------------
 */
package com.microsoft.tfs.demo;

import com.microsoft.tfs.demo.ImageService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

public class ImageServiceTest {

    private ImageService underTest;

    @Before
    public void setUp() {
        this.underTest = new ImageService();
    }

    @Test
    public void testGetImages() {
        List<Image> images = this.underTest.getImages();
        assertNotNull(images);

        // Only have one of the two lines below uncommented one at a time
        assertEquals(3, images.size());   // Leave this line in for no Earth
        //assertEquals(4, images.size()); // Uncomment this line for Earth
    }

    @Test
    public void testGetImagesSun() {
        List<Image> images = this.underTest.getImages();
        Image sun = getByName(images, "sun.png");
        assertEquals(660, sun.getWidth());
        assertEquals(660, sun.getHeight());
    }

    @Test
    public void testGetImagesJupiter() {
        List<Image> images = this.underTest.getImages();
        Image jupiter = getByName(images, "jupiter.png");
        assertEquals(512, jupiter.getWidth());
        assertEquals(512, jupiter.getHeight());
    }

    @Test
    public void testGetImagesSaturn() {
        List<Image> images = this.underTest.getImages();
        Image saturn = getByName(images, "saturn.png");
        assertEquals(1206, saturn.getWidth());
        assertEquals(690, saturn.getHeight());
    }

    @Test
    public void testGetImagesEarth() {
        // Uncomment the following test when Earth is added
        /*
        List<Image> images = this.underTest.getImages();
        Image earth = getByName(images, "earth.png");
        assertEquals(512, earth.getWidth());
        assertEquals(512, earth.getHeight());
        */
    }

    @Test
    public void getGetByNameSun() {
        Image sun = this.underTest.getByName("sun");
        assertEquals(660, sun.getWidth());
        assertEquals(660, sun.getHeight());
    }

    @Test
    public void getGetByNameJupiter() {
        Image jupiter = this.underTest.getByName("jupiter");
        assertEquals(512, jupiter.getWidth());
        assertEquals(512, jupiter.getHeight());
    }

    @Test
    public void getGetByNameSaturn() {
        Image saturn = this.underTest.getByName("saturn");
        assertEquals(1206, saturn.getWidth());
        assertEquals(690, saturn.getHeight());
    }

    @Test
    public void getGetByNameEarth() {
        // Uncomment the following test when Earth is added
        /*
        Image earth = this.underTest.getByName("earth");
        assertEquals(512, earth.getWidth());
        assertEquals(512, earth.getHeight());
        */
    }

    @Test
    public void getGetByNameNonExistent() {
        Image nonExistent = this.underTest.getByName("nonexistent");
        assertNull(nonExistent);
    }

    private Image getByName(final List<Image> images, final String name) {
        if (images != null) {
            for (Image i : images) {
                if (i.getSrc().endsWith(name)) {
                    return i;
                }
            }
        }
        return null;
    }
}
