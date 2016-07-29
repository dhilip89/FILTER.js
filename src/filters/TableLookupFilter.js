/**
*
* Table Lookup Filter
*
* Changes target image colors according to color lookup tables for each channel
*
* @param tableR Optional (a lookup table of 256 color values for red channel)
* @param tableG Optional (a lookup table of 256 color values for green channel)
* @param tableB Optional (a lookup table of 256 color values for blue channel)
* @param tableA Optional (a lookup table of 256 color values for alpha channel, NOT USED YET)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// color table
var CHANNEL = FILTER.CHANNEL, CT = FILTER.ColorTable, clamp = FILTER.Color.clampPixel,
    FilterUtil = FILTER.Util.Filter, eye = FilterUtil.ct_eye, ct_mult = FilterUtil.ct_multiply,
    Power = Math.pow, Exponential = Math.exp, nF = 1.0/255,
    TypedArray = FILTER.Util.Array.typed
;

//
//
// TableLookupFilter
var TableLookupFilter = FILTER.TableLookupFilter = FILTER.Class( FILTER.Filter, {
    name: "TableLookupFilter"
    
    ,constructor: function( tR, tG, tB, tA ) {
        var self = this;
        self.$super('constructor');
        self._table = [null, null, null, null];
        tR = tR || null;
        tG = tG || tR;
        tB = tB || tG;
        tA = tA || null;
        self._table[CHANNEL.R] = tR;
        self._table[CHANNEL.G] = tG;
        self._table[CHANNEL.B] = tB;
        self._table[CHANNEL.A] = tA;
    }
    
    ,path: FILTER_FILTERS_PATH
    // parameters
    ,_table: null
    
    ,dispose: function( ) {
        var self = this;
        self.$super('dispose');
        self._table = null;
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 _tableR: self._table[CHANNEL.R]
                ,_tableG: self._table[CHANNEL.G]
                ,_tableB: self._table[CHANNEL.B]
                ,_tableA: self._table[CHANNEL.A]
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._table[CHANNEL.R] = TypedArray(params._tableR, CT);
            self._table[CHANNEL.G] = TypedArray(params._tableG, CT);
            self._table[CHANNEL.B] = TypedArray(params._tableB, CT);
            self._table[CHANNEL.A] = TypedArray(params._tableA, CT);
        }
        return self;
    }
    
    ,channel: function( channel ) {
        if ( null == channel ) return this;
        var tR, tG, tB;
        switch(channel || CHANNEL.R)
        {
            case CHANNEL.B: 
                tR = eye(0,0); tG = eye(0,0); tB = eye(); 
                break;
            
            case CHANNEL.G: 
                tR = eye(0,0); tG = eye(); tB = eye(0,0); 
                break;
            
            case CHANNEL.R: 
            default:
                tR = eye(); tG = eye(0,0); tB = eye(0,0); 
                break;
            
        }
        return this.set(tR, tG, tB);
    }
    
    ,redChannel: function( ) {
        return this.channel( CHANNEL.R );
    }
    
    ,greenChannel: function( ) {
        return this.channel( CHANNEL.G );
    }
    
    ,blueChannel: function( ) {
        return this.channel( CHANNEL.B );
    }
    
    ,channelInvert: function( channel ) {
        if ( null == channel ) return this;
        var tR, tG, tB;
        switch(channel || CHANNEL.R)
        {
            case CHANNEL.B: 
                tR = eye(); tG = eye(); tB = eye(-1,255); 
                break;
            
            case CHANNEL.G: 
                tR = eye(); tG = eye(-1,255); tB = eye(); 
                break;
            
            case CHANNEL.R: 
            default:
                tR = eye(-1,255); tG = eye(); tB = eye(); 
                break;
            
        }
        return this.set(tR, tG, tB);
    }
    
    ,redInvert: function( ) {
        return this.channelInvert( CHANNEL.R );
    }
    
    ,greenInvert: function( ) {
        return this.channelInvert( CHANNEL.G );
    }
    
    ,blueInvert: function( ) {
        return this.channelInvert( CHANNEL.B );
    }
    
    /*,alphaInvert: function( ) {
        return this.channelInvert( CHANNEL.A );
    }*/
    
    ,invert: function( ) {
        return this.set(eye(-1,255));
    }
    
    ,thresholds: function( thresholdsR, thresholdsG, thresholdsB ) {
        // assume thresholds are given in pointwise scheme as pointcuts
        // not in cumulative scheme
        // [ 0.5 ] => [0, 1]
        // [ 0.3, 0.3, 0.3 ] => [0, 0.3, 0.6, 1]
        if (!thresholdsR.length) thresholdsR=[thresholdsR];
        if (!thresholdsG) thresholdsG=thresholdsR;
        if (!thresholdsB) thresholdsB=thresholdsG;

        var tLR=thresholdsR.length, numLevelsR=tLR+1, 
            tLG=thresholdsG.length, numLevelsG=tLG+1, 
            tLB=thresholdsB.length, numLevelsB=tLB+1, 
            tR=new CT(256), qR=new CT(numLevelsR), 
            tG=new CT(256), qG=new CT(numLevelsG), 
            tB=new CT(256), qB=new CT(numLevelsB), 
            i, j, nLR=255/(numLevelsR-1), nLG=255/(numLevelsG-1), nLB=255/(numLevelsB-1)
        ;
        i=0; while (i<numLevelsR) { qR[i] = ~~(nLR * i); i++; }
        thresholdsR[0]=~~(255*thresholdsR[0]);
        i=1; while (i<tLR) { thresholdsR[i]=thresholdsR[i-1] + ~~(255*thresholdsR[i]); i++; }
        i=0; while (i<numLevelsG) { qG[i] = ~~(nLG * i); i++; }
        thresholdsG[0]=~~(255*thresholdsG[0]);
        i=1; while (i<tLG) { thresholdsG[i]=thresholdsG[i-1] + ~~(255*thresholdsG[i]); i++; }
        i=0; while (i<numLevelsB) { qB[i] = ~~(nLB * i); i++; }
        thresholdsB[0]=~~(255*thresholdsB[0]);
        i=1; while (i<tLB) { thresholdsB[i]=thresholdsB[i-1] + ~~(255*thresholdsB[i]); i++; }

        for(i=0; i<256; i++)
        { 
            // the non-linear mapping is here
            j=0; while (j<tLR && i>thresholdsR[j]) j++;
            tR[ i ] = clamp(qR[ j ]); 
            j=0; while (j<tLG && i>thresholdsG[j]) j++;
            tG[ i ] = clamp(qG[ j ]); 
            j=0; while (j<tLB && i>thresholdsB[j]) j++;
            tB[ i ] = clamp(qB[ j ]); 
        }
        return this.set(tR, tG, tB);
    }
    
    ,threshold: function( thresholdR, thresholdG, thresholdB ) {
        thresholdR = null == thresholdR ? 0.5 : thresholdR;
        thresholdG = null == thresholdG ? thresholdR : thresholdG;
        thresholdB = null == thresholdB ? thresholdG : thresholdB;
        return this.thresholds([thresholdR], [thresholdG], [thresholdB]);
    }
    
    ,quantize: function( numLevels ) {
        if ( null == numLevels ) numLevels = 64;
        if ( numLevels < 2 ) numLevels = 2;

        var t=new CT(256), q=new CT(numLevels), i, nL=255/(numLevels-1), nR=numLevels/256;
        i=0; while (i<numLevels) { q[i] = ~~(nL * i); i++; }
        for(i=0; i<256; i++) { t[i] = clamp(q[ ~~(nR * i) ]); }
        return this.set(t);
    }
    
    ,binarize: function( ) {
        return this.quantize(2);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,solarize: function( threshold, type ) {
        if ( null == type ) type = 1;
        if ( null == threshold ) threshold=0.5;
        
        var i, t=new CT(256), q, c, n=2/255;
        if ( -1 === type ) // inverse
        {
            threshold *= 256; 
            for(i=0; i<256; i++)
            { 
                t[i] = i>threshold ? 255-i : i; 
            }
        }
        else if ( 2 === type ) // variation
        {
            threshold = 1-threshold;
            for(i=0; i<256; i++)
            { 
                q = n*i; 
                c = q<threshold ? (255-255*q) : (255*q-255); 
                t[i] = ~~(clamp( c ));
            }
        }
        else
        {
            for(i=0; i<256; i++)
            { 
                q = n*i; 
                c = q>threshold ? (255-255*q) : (255*q-255); 
                t[i] = ~~(clamp( c ));
            }
        }
        return this.set(t);
    }
    
    ,solarize2: function( threshold ) {
        return this.solarize( threshold, 2 );
    }
    
    ,solarizeInverse: function( threshold ) {
        return this.solarize( threshold, -1 );
    }
    
    // apply a binary mask to the image color channels
    ,mask: function( mask ) {
        var i=0, tR=new CT(256), tG=new CT(256), tB=new CT(256),
            maskR=(mask>>>16)&255, maskG=(mask>>>8)&255, maskB=mask&255
        ;
        for(i=0; i<256; i++)
        { 
            tR[i] = clamp(i & maskR); 
            tG[i] = clamp(i & maskG); 
            tB[i] = clamp(i & maskB); 
        }
        return this.set(tR, tG, tB);
    }
    
    // replace a color with another
    ,replace: function( color, replacecolor ) {
        if (color==replacecolor) return this;
        var c1R=(color>>>16)&255, c1G=(color>>>8)&255, c1B=(color)&255, 
            c2R=(replacecolor>>>16)&255, c2G=(replacecolor>>>8)&255, c2B=(replacecolor)&255, 
            tR=eye(), tG=eye(), tB=eye();
            tR[c1R]=c2R; tG[c1G]=c2G; tB[c1B]=c2B;
        return this.set(tR, tG, tB);
    }
    
    // extract a range of color values from a specific color channel and set the rest to background color
    ,extract: function( channel, range, background ) {
        if (!range || !range.length) return this;
        background=background||0;
        var bR = (background>>>16)&255, bG = (background>>>8)&255, bB = background&255, 
            tR=eye(0,bR), tG=eye(0,bG), tB=eye(0,bB), s, f;
        switch(channel || CHANNEL.R)
        {
            case CHANNEL.B:
                s=range[0]; f=range[1];
                while (s<=f) { tB[s]=clamp(s); s++; }
                break;
            
            case CHANNEL.G:
                s=range[0]; f=range[1];
                while (s<=f) { tG[s]=clamp(s); s++; }
                break;
            
            case CHANNEL.R:
            default:
                s=range[0]; f=range[1];
                while (s<=f) { tR[s]=clamp(s); s++; }
                break;
            
        }
        return this.set(tR, tG, tB);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,gammaCorrection: function( gammaR, gammaG, gammaB ) {
        gammaR = gammaR || 1;
        gammaG = gammaG || gammaR;
        gammaB = gammaB || gammaG;
        
        // gamma correction uses inverse gamma
        gammaR = 1.0/gammaR; gammaG = 1.0/gammaG; gammaB = 1.0/gammaB;
        
        var tR=new CT(256), tG=new CT(256), tB=new CT(256), i=0;
        for(i=0; i<256; i++)
        { 
            tR[i] = clamp(~~(255*Power(nF*i, gammaR))); 
            tG[i] = clamp(~~(255*Power(nF*i, gammaG))); 
            tB[i] = clamp(~~(255*Power(nF*i, gammaB)));  
        }
        return this.set(tR, tG, tB);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,exposure: function( exposure ) {
        if ( null == exposure ) exposure = 1;
        var i=0, t=new CT(256);
        for(i=0; i<256; i++)
        { 
            t[i]=clamp(~~(255 * (1 - Exponential(-exposure * i *nF)))); 
        }
        return this.set(t);
    }
    
    ,set: function( tR, tG, tB, tA ) {
        if ( !tR ) return this;
        
        var i, T = this._table, R = T[CHANNEL.R] || eye( ), G, B, A;
        
        if ( tG || tB )
        {
            tG = tG || tR; tB = tB || tG;
            G = T[CHANNEL.G] || R; B = T[CHANNEL.B] || G;
            T[CHANNEL.R] = ct_mult( tR, R );
            T[CHANNEL.G] = ct_mult( tG, G );
            T[CHANNEL.B] = ct_mult( tB, B );
        }
        else
        {
            T[CHANNEL.R] = ct_mult( tR, R );
            T[CHANNEL.G] = T[CHANNEL.R];
            T[CHANNEL.B] = T[CHANNEL.R];
        }
        return this;
    }
    
    ,reset: function( ) {
        this._table = [null, null, null, null]; 
        return this;
    }
    
    ,combineWith: function( filt ) {
        return this.set(filt.getTable(CHANNEL.R), filt.getTable(CHANNEL.G), filt.getTable(CHANNEL.B));
    }
    
    ,getTable: function ( channel ) {
        return this._table[channel || CHANNEL.R] || null;
    }
    
    ,setTable: function ( table, channel ) {
        this._table[channel || CHANNEL.R] = table || null;
        return this;
    }
    
    // used for internal purposes
    ,_apply: function(im, w, h/*, image*/) {
        var self = this, T = self._table;
        if ( !self._isOn || !T || !T[CHANNEL.R] ) return im;
        
        var i, l=im.length, rem = (l>>>2)%16, R = T[0], G = T[1], B = T[2], A = T[3];
        
        // apply filter (algorithm implemented directly based on filter definition)
        if ( A )
        {
            // array linearization
            // partial loop unrolling (4 iterations)
            for (i=0; i<l; i+=64)
            {
                im[i   ] = R[im[i   ]]; im[i+1 ] = G[im[i+1 ]]; im[i+2 ] = B[im[i+2 ]]; im[i+3 ] = A[im[i+3 ]];
                im[i+4 ] = R[im[i+4 ]]; im[i+5 ] = G[im[i+5 ]]; im[i+6 ] = B[im[i+6 ]]; im[i+7 ] = A[im[i+7 ]];
                im[i+8 ] = R[im[i+8 ]]; im[i+9 ] = G[im[i+9 ]]; im[i+10] = B[im[i+10]]; im[i+11] = A[im[i+11]];
                im[i+12] = R[im[i+12]]; im[i+13] = G[im[i+13]]; im[i+14] = B[im[i+14]]; im[i+15] = A[im[i+15]];
                im[i+16] = R[im[i+16]]; im[i+17] = G[im[i+17]]; im[i+18] = B[im[i+18]]; im[i+19] = A[im[i+19]];
                im[i+20] = R[im[i+20]]; im[i+21] = G[im[i+21]]; im[i+22] = B[im[i+22]]; im[i+23] = A[im[i+23]];
                im[i+24] = R[im[i+24]]; im[i+25] = G[im[i+25]]; im[i+26] = B[im[i+26]]; im[i+27] = A[im[i+27]];
                im[i+28] = R[im[i+28]]; im[i+29] = G[im[i+29]]; im[i+30] = B[im[i+30]]; im[i+31] = A[im[i+31]];
                im[i+32] = R[im[i+32]]; im[i+33] = G[im[i+33]]; im[i+34] = B[im[i+34]]; im[i+35] = A[im[i+35]];
                im[i+36] = R[im[i+36]]; im[i+37] = G[im[i+37]]; im[i+38] = B[im[i+38]]; im[i+39] = A[im[i+39]];
                im[i+40] = R[im[i+40]]; im[i+41] = G[im[i+41]]; im[i+42] = B[im[i+42]]; im[i+43] = A[im[i+43]];
                im[i+44] = R[im[i+44]]; im[i+45] = G[im[i+45]]; im[i+46] = B[im[i+46]]; im[i+47] = A[im[i+47]];
                im[i+48] = R[im[i+48]]; im[i+49] = G[im[i+49]]; im[i+50] = B[im[i+50]]; im[i+51] = A[im[i+51]];
                im[i+52] = R[im[i+52]]; im[i+53] = G[im[i+53]]; im[i+54] = B[im[i+54]]; im[i+55] = A[im[i+55]];
                im[i+56] = R[im[i+56]]; im[i+57] = G[im[i+57]]; im[i+58] = B[im[i+58]]; im[i+59] = A[im[i+59]];
                im[i+60] = R[im[i+60]]; im[i+61] = G[im[i+61]]; im[i+62] = B[im[i+62]]; im[i+63] = A[im[i+63]];
            }
            // loop unrolling remainder
            if ( rem )
            {
                for (i=l-(rem<<2); i<l; i+=4)
                    im[i   ] = R[im[i   ]]; im[i+1 ] = G[im[i+1 ]]; im[i+2 ] = B[im[i+2 ]]; im[i+3 ] = A[im[i+3 ]];
            }
        }
        else
        {
            // array linearization
            // partial loop unrolling (4 iterations)
            for (i=0; i<l; i+=64)
            {
                im[i   ] = R[im[i   ]]; im[i+1 ] = G[im[i+1 ]]; im[i+2 ] = B[im[i+2 ]];
                im[i+4 ] = R[im[i+4 ]]; im[i+5 ] = G[im[i+5 ]]; im[i+6 ] = B[im[i+6 ]];
                im[i+8 ] = R[im[i+8 ]]; im[i+9 ] = G[im[i+9 ]]; im[i+10] = B[im[i+10]];
                im[i+12] = R[im[i+12]]; im[i+13] = G[im[i+13]]; im[i+14] = B[im[i+14]];
                im[i+16] = R[im[i+16]]; im[i+17] = G[im[i+17]]; im[i+18] = B[im[i+18]];
                im[i+20] = R[im[i+20]]; im[i+21] = G[im[i+21]]; im[i+22] = B[im[i+22]];
                im[i+24] = R[im[i+24]]; im[i+25] = G[im[i+25]]; im[i+26] = B[im[i+26]];
                im[i+28] = R[im[i+28]]; im[i+29] = G[im[i+29]]; im[i+30] = B[im[i+30]];
                im[i+32] = R[im[i+32]]; im[i+33] = G[im[i+33]]; im[i+34] = B[im[i+34]];
                im[i+36] = R[im[i+36]]; im[i+37] = G[im[i+37]]; im[i+38] = B[im[i+38]];
                im[i+40] = R[im[i+40]]; im[i+41] = G[im[i+41]]; im[i+42] = B[im[i+42]];
                im[i+44] = R[im[i+44]]; im[i+45] = G[im[i+45]]; im[i+46] = B[im[i+46]];
                im[i+48] = R[im[i+48]]; im[i+49] = G[im[i+49]]; im[i+50] = B[im[i+50]];
                im[i+52] = R[im[i+52]]; im[i+53] = G[im[i+53]]; im[i+54] = B[im[i+54]];
                im[i+56] = R[im[i+56]]; im[i+57] = G[im[i+57]]; im[i+58] = B[im[i+58]];
                im[i+60] = R[im[i+60]]; im[i+61] = G[im[i+61]]; im[i+62] = B[im[i+62]];
            }
            // loop unrolling remainder
            if ( rem )
            {
                for (i=l-(rem<<2); i<l; i+=4)
                    im[i   ] = R[im[i   ]]; im[i+1 ] = G[im[i+1 ]]; im[i+2 ] = B[im[i+2 ]];
            }
        }
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._table && this._table[CHANNEL.R];
    }
});
// aliases
TableLookupFilter.prototype.posterize = TableLookupFilter.prototype.levels = TableLookupFilter.prototype.quantize;

}(FILTER);